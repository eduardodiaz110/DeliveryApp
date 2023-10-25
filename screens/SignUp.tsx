import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { api } from "../functions/api";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParams } from "../Navigator";

const SignUp = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParams>>();

  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
  const { setCartID } = React.useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    const signUpQuery = `
      mutation {
        customerCreate(input: {
          email: "${email}",
          password: "${password}",
          firstName: "${firstName}",
          lastName: "${lastName}"
        }) {
          customer {
            id
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const signUpResult = await api(signUpQuery);

      if (signUpResult.data && signUpResult.data.customerCreate.customer) {
        const loginQuery = `
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

        const loginResult = await api(loginQuery);

        if (
          loginResult.data &&
          loginResult.data.customerAccessTokenCreate.customerAccessToken
        ) {
          await SecureStore.setItemAsync(
            "userToken",
            loginResult.data.customerAccessTokenCreate.customerAccessToken
              .accessToken
          );
          setIsAuthenticated(true);
        } else if (
          loginResult.data &&
          loginResult.data.customerAccessTokenCreate.userErrors.length > 0
        ) {
          setError(
            loginResult.data.customerAccessTokenCreate.userErrors[0].message
          );
        } else {
          console.log("Unknown login error after sign up");
        }
      } else if (
        signUpResult.data &&
        signUpResult.data.customerCreate.customerUserErrors.length > 0
      ) {
        setError(
          signUpResult.data.customerCreate.customerUserErrors[0].message
        );
      } else {
        console.log("Unknown sign up error");
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
      <Text>Sign Up</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 5,
        }}
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 5,
        }}
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
      />
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
      <Button title="Sign Up" onPress={handleSignUp} disabled={loading} />
      <Button
        title="Login"
        onPress={() => {
          navigation.navigate("Login");
        }}
        disabled={loading}
      />

      {error && <Text>Error: {error}</Text>}
    </View>
  );
};

export default SignUp;
