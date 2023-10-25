import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { api } from "../functions/api";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../modules/DrawerNavigatorModule";
import * as SecureStore from "expo-secure-store";
import { RootStackParams, ShopStackParams } from "../Navigator";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AppContext } from "../AppContext";

export type Props = {
  route: StackScreenProps<ShopStackParams, "ProductScreen">["route"];
};

export const ProductScreen: React.FC<Props> = ({ route }) => {
  const { productData } = route.params;
  const { products, cartID, cursor, setCartID, setCursor } =
    React.useContext(AppContext);

  const navigation = useNavigation<StackNavigationProp<ShopStackParams>>();

  const [quantity, setQuantity] = useState<number>(1);
  const [variant, setVariant] = useState<string | null>(
    productData.variants.edges[0].node.id
  );

  const addToCart = async () => {
    const savedToken = await SecureStore.getItemAsync("userToken");

    if (!savedToken) {
      try {
        if (!cartID) {
          const query = `
              mutation {
                cartCreate(
                  input: {
                    lines: [
                      {
                        quantity: ${quantity}
                        merchandiseId: "${variant}"
                      }
                    ],
                    buyerIdentity: {
                      countryCode: MX
                    },
                    attributes: {
                      key: "cart_attribute",
                      value: "This is a cart attribute"
                    }
                  }
                ) {
                  cart {
                    id
                  }
                }
              }

            `;
          const data = await api(query);
          setCartID(data.data.cartCreate.cart.id);
          navigation.navigate("CartScreen");
        } else {
          const query = `
              mutation {
                cartLinesAdd(
                  cartId: "${cartID}",
                  lines: [
                    {
                      quantity: ${quantity}
                      merchandiseId: "${variant}"
                    }
                  ]
                )
                {
                  cart {
                    id

                  }
                }
              }
            `;
          const data = await api(query);
          setCartID(data.data.cartLinesAdd.cart.id);
          navigation.navigate("CartScreen");
        }
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    } else {
      try {
        if (!cartID) {
          const query = `
              mutation {
                cartCreate(
                  input: {
                    lines: [
                      {
                        quantity: ${quantity}
                        merchandiseId: "${variant}"
                      }
                    ],
                    buyerIdentity: {
                      countryCode: MX
                      customerAccessToken: "${savedToken}"

                    },
                    attributes: {
                      key: "cart_attribute",
                      value: "This is a cart attribute"
                    }
                  }
                ) {
                  cart {
                    id
                  }
                }
              }

            `;
          const data = await api(query);
          setCartID(data.data.cartCreate.cart.id);
          navigation.navigate("CartScreen");
        } else {
          const query = `
              mutation {
                cartLinesAdd(
                  cartId: "${cartID}",
                  lines: [
                    {
                      quantity: ${quantity}
                      merchandiseId: "${variant}"
                    }
                  ]
                )
                {
                  cart {
                    id

                  }
                }
              }
            `;
          const data = await api(query);
          setCartID(data.data.cartLinesAdd.cart.id);
          navigation.navigate("CartScreen");
        }
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    }
  };

  return (
    <View style={styles.modalContainer}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{productData.title}</Text>
        <Button title="Close" />
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productData.images.edges[0].node.originalSrc }}
            style={styles.image}
          />
        </View>
        {productData.variants.edges.map((variantbtn: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={
              variant === variantbtn.node.id
                ? styles.variantSelectedButton
                : styles.variantButton
            }
            onPress={() => {
              setVariant(variantbtn.node.id);
            }}
          >
            <Text
              style={
                variant === variantbtn.node.id
                  ? styles.variantSelectTextButton
                  : styles.variantTextButton
              }
            >
              {variantbtn.node.title} - {variantbtn.node.priceV2.amount}{" "}
              {variantbtn.node.priceV2.currencyCode}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(quantity)}
            onChangeText={(text) => setQuantity(Number(text))}
          />
          <Button title="Agregar al Carrito" onPress={() => addToCart()} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  scrollView: {
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  variantButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",

    borderRadius: 5,
  },
  variantSelectedButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#1976D2",
    color: "white",
    borderRadius: 5,
  },
  variantTextButton: {
    color: "black",
  },
  variantSelectTextButton: {
    color: "white",
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  input: {
    width: "40%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
