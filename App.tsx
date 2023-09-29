import "react-native-gesture-handler";
import * as React from "react";
import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import { Products } from "./modules/Products";
import { api } from "./functions/api";

const Drawer = createDrawerNavigator();

export default function App() {
  const [cartID, setCartID] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<Products | null>(null);

  //Fetch products
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `
        {
          products(first:10) {
            edges {
              node {
                title
                description
                images(first: 1) {
                  edges {
                    node {
                      originalSrc
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;
        const data = await api(query);
        setProducts(data.data.products);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          children={() => (
            <HomeScreen
              cartID={cartID}
              setCartID={setCartID}
              products={products}
            />
          )} // Pasando props aquí
        />
        <Drawer.Screen
          name="Cart"
          children={() => <Cart cartID={cartID} setCartID={setCartID} />} // Pasando props aquí
        />
        <Drawer.Screen name="Checkout" component={Checkout} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
