import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../modules/DrawerNavigator";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { api } from "../functions/api";

type CartNavigationProp = DrawerNavigationProp<RootDrawerParamList, "Checkout">;

type CartProps = {
  cartID: string | null;
  setCartID: React.Dispatch<React.SetStateAction<string | null>>;
};

const Cart: React.FC<CartProps> = ({ cartID, setCartID }) => {
  const [cart, setCart] = useState<any>(null);
  const navigation = useNavigation<CartNavigationProp>();

  // retrieve cart
  useFocusEffect(() => {
    const retrieveCart = async () => {
      try {
        const query = `
              {
                cart(
                    id: "${cartID}"
                  ) {
                    id
                    createdAt
                    updatedAt
                    lines(first: 10) {
                      edges {
                        node {
                          id
                          quantity
                          merchandise {
                            ... on ProductVariant {
                              id
                              product {
                                title 
                                }
        
                              image {
                                originalSrc
                              }
                              priceV2 {
                                amount
                                currencyCode
                              } 
                            }
                          }
                          attributes {
                            key
                            value
                          }
                        }
                      }
                    }
                    attributes {
                      key
                      value
                    }
                    cost {
                      totalAmount {
                        amount
                        currencyCode
                      }
                      subtotalAmount {
                        amount
                        currencyCode
                      }
                      totalTaxAmount {
                        amount
                        currencyCode
                      }
                      totalDutyAmount {
                        amount
                        currencyCode
                      }
                    }
                    buyerIdentity {
                      email
                      phone
                      customer {
                        id
                      }
                      countryCode
                      deliveryAddressPreferences {
                        ... on MailingAddress {
                          address1
                          address2
                          city
                          provinceCode
                          countryCodeV2
                          zip
                        }
                      }
                    }
                  }
              }
            `;

        const data = await api(query);
        if (!data) {
          return <Text>Loading...</Text>;
        }

        setCart(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    retrieveCart();
  });

  const goToCheckout = async () => {
    try {
      const query = `
      query checkoutURL {
          cart(id: "${cartID}") {
            checkoutUrl
          }
        }
        
    `;
      const data = await api(query);
      navigation.navigate("Checkout", {
        checkoutUrl: data.data.cart.checkoutUrl,
        timestamp: new Date().getTime(),
      });
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {cart ? (
        cart.cart.lines.edges.map((item: any, index: any) => (
          <View key={index} style={styles.cartItem}>
            <View>
              <Text style={styles.itemText}>
                {item.node.merchandise.product.title}
              </Text>
              <Image
                source={{ uri: item.node.merchandise.image.originalSrc }}
                style={{ width: 50, height: 50 }}
              />
              <Text style={styles.itemSubText}>
                Quantity: {item.node.quantity}
              </Text>
            </View>
            <Text style={styles.itemText}>
              Total:{" "}
              {(
                item.node.quantity * item.node.merchandise.priceV2.amount
              ).toFixed(2)}{" "}
              {item.node.merchandise.priceV2.currencyCode}
            </Text>
          </View>
        ))
      ) : (
        <Text>Loading...</Text>
      )}
      {cart && (
        <Text style={styles.totalAmount}>
          Total Amount: {cart.cart.cost.totalAmount.amount}{" "}
          {cart.cart.cost.totalAmount.currencyCode}
        </Text>
      )}

      <Button title="Checkout" onPress={() => goToCheckout()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cartItem: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 18,
  },
  itemSubText: {
    fontSize: 14,
    color: "#6c757d",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Cart;
