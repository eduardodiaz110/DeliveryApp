import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Navigator, RootStackParams } from "./Navigator";
import { Text } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import Prueba from "./screens/Prueba";
import { AuthProvider } from "./auth/AuthContext";
import { AppProvider } from "./AppContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

const RootTab = createStackNavigator<RootStackParams>();

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}
