import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";

import { RouteProp } from "@react-navigation/native";
import { RootDrawerParamList } from "../modules/DrawerNavigator";

type CheckoutRouteProp = RouteProp<RootDrawerParamList, "Checkout">;

const Checkout: React.FC = () => {
  const route = useRoute<CheckoutRouteProp>();
  const { checkoutUrl, timestamp } = route.params;
  const [randomNumber, setRandomNumber] = useState<number>(0);

  useEffect(() => {
    setRandomNumber(Math.random());
  }, [timestamp]);

  return (
    <WebView
      key={randomNumber}
      style={{ marginTop: -70 }}
      source={{ uri: checkoutUrl }}
      startInLoadingState={true}
    />
  );
};

export default Checkout;
