import "react-native-gesture-handler";
import * as React from "react";
import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import Cart from "./screens/Cart";

const Drawer = createDrawerNavigator();

export default function App() {
  const [cartID, setCartID] = React.useState<string | null>(null);
  React.useEffect(() => {
    console.log(cartID);
  }, [cartID]);
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          children={() => <HomeScreen cartID={cartID} setCartID={setCartID} />} // Pasando props aquí
        />
        <Drawer.Screen
          name="Cart"
          children={() => <Cart cartID={cartID} setCartID={setCartID} />} // Pasando props aquí
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
