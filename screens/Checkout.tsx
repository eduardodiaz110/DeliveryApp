import React, { useEffect, useState } from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useRoute } from "@react-navigation/native";

import { RouteProp } from "@react-navigation/native";
import { RootDrawerParamList } from "../modules/DrawerNavigatorModule";

type CheckoutRouteProp = RouteProp<RootDrawerParamList, "Checkout">;

const Checkout: React.FC = () => {
  const route = useRoute<CheckoutRouteProp>();
  const { checkoutUrl, timestamp } = route.params;
  const [randomNumber, setRandomNumber] = useState<number>(0);

  useEffect(() => {
    setRandomNumber(Math.random());
  }, [timestamp]);

  const handleNavigationChange = (navState: WebViewNavigation) => {
    if (navState.url.includes("thank_you")) {
      console.log("compra");
    }
  };

  return (
    <WebView
      key={randomNumber}
      style={{ marginTop: -70 }}
      source={{ uri: checkoutUrl }}
      startInLoadingState={true}
      onNavigationStateChange={handleNavigationChange}
    />
  );
};

export default Checkout;
