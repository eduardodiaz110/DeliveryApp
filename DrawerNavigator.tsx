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
import Login from "./screens/Login";
import Account from "./screens/Account";
import SignUp from "./screens/SignUp";
import * as SecureStore from "expo-secure-store";
import { AuthProvider, AuthContext } from "./auth/AuthContext";

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);

  const [cartID, setCartID] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<Products | null>(null);
  const [categories, setCategories] = React.useState<Products | null>(null);

  //Fetch products and categories
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `
            {
              products(first:20) {
                edges {
                  node {
                    title
                    description
                    collections(first: 10) {
                      edges {
                        node {
                          title
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          originalSrc
                        }
                      }
                    }
                    variants(first: 10) {
                      edges {
                        node {
                          id
                          title
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
    const fetchCategories = async () => {
      try {
        const query = `
              {
                collections(first: 10) {
                  edges {
                    node {
                      title
                    }
                  }
                }
              }
            `;

        const { data } = await api(query);
        const dataMapped = data.collections.edges.map(
          (edge: any) => edge.node.title
        );
        setCategories(dataMapped);
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <Drawer.Navigator initialRouteName={isAuthenticated ? "Store" : "Login"}>
      {isAuthenticated ? (
        <>
          <Drawer.Screen
            name="Store"
            children={() => (
              <HomeScreen
                cartID={cartID}
                setCartID={setCartID}
                products={products}
                categories={categories}
              />
            )}
          />
          <Drawer.Screen
            name="Cart"
            children={() => <Cart cartID={cartID} setCartID={setCartID} />}
          />
          <Drawer.Screen name="Checkout" component={Checkout} />
          <Drawer.Screen
            name="Account"
            children={() => <Account setCartID={setCartID} />}
          ></Drawer.Screen>
        </>
      ) : (
        <>
          <Drawer.Screen
            name="Login"
            children={() => <Login setCartID={setCartID} />}
          />
          <Drawer.Screen
            name="SignUp"
            children={() => <SignUp setCartID={setCartID} />}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}
