import "react-native-gesture-handler";
import * as React from "react";
import { AuthContext } from "./auth/AuthContext";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import { Products } from "./modules/Products";
import { api } from "./functions/api";

//screens
import HomeScreen from "./screens/HomeScreen";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import Login from "./screens/Login";
import Account from "./screens/Account";
import SignUp from "./screens/SignUp";
import Product from "./screens/Product";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export type RootStackParams = {
  HomeScreen: undefined;
  Product: {
    productData: any;
  };
  Cart: undefined;
};

const Drawer = createDrawerNavigator();
const Stack = createBottomTabNavigator<RootStackParams>();

// export function ProductStack() {
//   return (
//     <Stack.Navigator initialRouteName="HomeScreen">
//       <Stack.Screen name="HomeScreen" component={HomeScreen} />
//       <Stack.Screen name="Product" component={Product} />
//     </Stack.Navigator>
//   );
// }

export function Navigator() {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);

  // const [cartID, setCartID] = React.useState<string | null>(null);
  // const [cursor, setCursor] = React.useState(null);
  // const [products, setProducts] = React.useState<Products | null>(null);
  // const [categories, setCategories] = React.useState<Products | null>(null);

  // // React.useEffect(() => {
  // //   console.log(`cursor ${JSON.stringify(cursor)}`);
  // // }, [cursor]);

  // //Fetch products and categories
  // React.useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const query = `
  //           {
  //             products(first:10) {
  //               pageInfo {
  //                 hasNextPage
  //                 endCursor
  //               }

  //               edges {
  //                 node {
  //                   title
  //                   description
  //                   collections(first: 10) {
  //                     edges {
  //                       node {
  //                         title
  //                       }
  //                     }
  //                   }
  //                   images(first: 1) {
  //                     edges {
  //                       node {
  //                         originalSrc
  //                       }
  //                     }
  //                   }
  //                   variants(first: 10) {
  //                     edges {
  //                       node {
  //                         id
  //                         title
  //                         priceV2 {
  //                           amount
  //                           currencyCode
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         `;
  //       const data = await api(query);
  //       setProducts(data.data.products);
  //       setCursor(data.data.products.pageInfo.endCursor);
  //     } catch (error) {
  //       console.error("Error obteniendo datos:", error);
  //     }
  //   };
  //   const fetchCategories = async () => {
  //     try {
  //       const query = `
  //             {
  //               collections(first: 10) {
  //                 edges {
  //                   node {
  //                     title
  //                   }
  //                 }
  //               }
  //             }
  //           `;

  //       const { data } = await api(query);
  //       const dataMapped = data.collections.edges.map(
  //         (edge: any) => edge.node.title
  //       );
  //       setCategories(dataMapped);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //       return [];
  //     }
  //   };

  //   fetchProducts();
  //   fetchCategories();
  // }, []);

  return (
    // <Drawer.Navigator
    //   screenOptions={{
    //     headerStyle: {
    //       backgroundColor: "orange", // Establece el color de fondo del encabezado a naranja
    //     },
    //     headerTintColor: "#fff", // Establece el color del texto del encabezado a blanco
    //     headerTitleStyle: {
    //       fontWeight: "bold", // Establece el peso del texto del encabezado a negrita
    //     },
    //   }}
    //   initialRouteName={isAuthenticated ? "Store" : "Login"}
    // >
    //   {isAuthenticated ? (
    //     <>
    //       <Drawer.Screen
    //         name="SNOWBOARDING MTY"
    //         children={() => (
    //           <HomeScreen
    //             cartID={cartID}
    //             setCartID={setCartID}
    //             products={products}
    //             categories={categories}
    //             cursor={cursor}
    //             setCursor={setCursor}
    //           />
    //         )}
    //       />
    //       <Drawer.Screen
    //         name="Cart"
    //         children={() => <Cart cartID={cartID} setCartID={setCartID} />}
    //       />
    //       <Drawer.Screen name="Checkout" component={Checkout} />
    //       <Drawer.Screen
    //         name="Account"
    //         children={() => <Account setCartID={setCartID} />}
    //       ></Drawer.Screen>
    //     </>
    //   ) : (
    //     <>
    //       <Drawer.Screen
    //         name="Login"
    //         children={() => <Login setCartID={setCartID} />}
    //       />
    //       <Drawer.Screen
    //         name="SignUp"
    //         children={() => <SignUp setCartID={setCartID} />}
    //       />
    //     </>
    //   )}
    // </Drawer.Navigator>
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  );
}
