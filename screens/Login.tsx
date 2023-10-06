import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { api } from "../functions/api";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../modules/DrawerNavigatorModule";
import { TouchableOpacity } from "react-native-gesture-handler";

type LoginNavigationProp = DrawerNavigationProp<RootDrawerParamList, "SignUp">;

type LoginProps = {
  setCartID: React.Dispatch<React.SetStateAction<string | null>>;
};

const Cart: React.FC<LoginProps> = ({ setCartID }) => {
  const navigation = useNavigation<LoginNavigationProp>();

  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = `
      mutation {
        customerAccessTokenCreate(input: {
          email: "${email}",
          password: "${password}"
        }) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

      const result = await api(query);

      if (
        result.data &&
        result.data.customerAccessTokenCreate.customerAccessToken
      ) {
        setToken(
          result.data.customerAccessTokenCreate.customerAccessToken.accessToken
        );
        await SecureStore.setItemAsync(
          "userToken",
          result.data.customerAccessTokenCreate.customerAccessToken.accessToken
        );
        setIsAuthenticated(true);
      } else if (
        result.data &&
        result.data.customerAccessTokenCreate.userErrors.length > 0
      ) {
        setError(result.data.customerAccessTokenCreate.userErrors[0].message);
      } else {
        console.log("Unknown error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setCartID(null);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 5,
        }}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 5,
        }}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      <Button
        title="Crear una Nueva Cuenta"
        onPress={() => {
          navigation.navigate("SignUp");
        }}
        disabled={loading}
      />

      <Button
        title="Comprar como Invitado"
        disabled={loading}
        onPress={() => {
          setIsAuthenticated(true);
        }}
      />

      {token && <Text>Logged in with token: {token}</Text>}
      {error && <Text>Error: {error}</Text>}
    </View>
  );
};

export default Cart;
