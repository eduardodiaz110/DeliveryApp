import * as React from "react";
import { AuthContext } from "./auth/AuthContext";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//screens
import HomeScreen from "./screens/HomeScreen";
import { CartScreen } from "./screens/CartScreen";
import CheckoutScreen from "./screens/Checkout";
import Login from "./screens/Login";
import AccountScreen from "./screens/Account";
import SignUp from "./screens/SignUp";
import { ProductScreen } from "./screens/ProductScreen";
import { Shop } from "@mui/icons-material";

//AuthStack
export type AuthStackParams = {
  Login: undefined;
  SignUp: undefined;
};

const AuthStack = createStackNavigator<AuthStackParams>();

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
};

//ShopStack
export type ShopStackParams = {
  HomeScreen: undefined;
  ProductScreen: {
    productData: any;
  };
  CartScreen: undefined;
  CheckoutScreen: {
    checkoutUrl: string;
    timestamp: number;
  };
};

const ShopStack = createStackNavigator<ShopStackParams>();

const ShopStackScreen = () => {
  return (
    <ShopStack.Navigator>
      <ShopStack.Screen name="HomeScreen" component={HomeScreen} />
      <ShopStack.Screen name="ProductScreen" component={ProductScreen} />
      <ShopStack.Screen name="CartScreen" component={CartScreen} />
      <ShopStack.Screen name="CheckoutScreen" component={CheckoutScreen} />
    </ShopStack.Navigator>
  );
};

//RootStack

export type RootStackParams = {
  ShopStack: ShopStackParams;
  AccountScreen: undefined;
  AuthStack: AuthStackParams;
};

const RootTab = createBottomTabNavigator<RootStackParams>();

export function Navigator() {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);

  return (
    <>
      {isAuthenticated ? (
        <RootTab.Navigator>
          <RootTab.Screen
            name="ShopStack"
            component={ShopStackScreen}
            options={{ title: "Shop", headerShown: false }}
          />
          <RootTab.Screen
            name="AccountScreen"
            component={AccountScreen}
            options={{ title: "Account" }}
          />
        </RootTab.Navigator>
      ) : (
        <RootTab.Navigator>
          <RootTab.Screen
            name="AuthStack"
            component={AuthStackScreen}
            options={{ title: "Auth", headerShown: false }}
          />
        </RootTab.Navigator>
      )}
    </>
  );
}
