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
import { DrawerNavigator } from "./DrawerNavigator";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
