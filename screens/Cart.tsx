import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../modules/DrawerNavigatorModule";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { api } from "../functions/api";
import * as SecureStore from "expo-secure-store";

type CartNavigationProp = DrawerNavigationProp<RootDrawerParamList, "Checkout">;

type CartProps = {
  cartID: string | null;
  setCartID: React.Dispatch<React.SetStateAction<string | null>>;
};

const Cart: React.FC<CartProps> = ({ cartID, setCartID }) => {
  const [cart, setCart] = useState<any>({ cart: { lines: { edges: [] } } });

  const navigation = useNavigation<CartNavigationProp>();

  // constantly retrieve cart
  useFocusEffect(() => {
    const retrieveCart = async () => {
      try {
        const query = `
        {
          cart(id: "${cartID}") {
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
    const savedToken = await SecureStore.getItemAsync("userToken");
    const lineItems = cart.cart.lines.edges
      .map((item: any) => {
        return `{variantId: "${item.node.merchandise.id}", quantity: ${item.node.quantity}}`;
      })
      .join(", ");

    try {
      if (!savedToken) {
        try {
          const query = `
        query checkoutURL {
            cart(id: "${cartID}") {
              checkoutUrl
            }
          }

      `;

          const data = await api(query);
          console.log("invitado", data);
          navigation.navigate("Checkout", {
            checkoutUrl: data.data.cart.checkoutUrl,
            timestamp: new Date().getTime(),
          });
          return;
        } catch (error) {
          console.error("Error obteniendo datos:", error);
        }
      }

      const queryCreateCheckout = `
      mutation {
      checkoutCreate(input: {
        lineItems: [${lineItems}], 
      }) {
        checkout {
          id
          webUrl
        }
        userErrors {
          message
        }
      }
    }
  `;
      const data = await api(queryCreateCheckout);
      const checkoutId = data.data.checkoutCreate.checkout.id;
      console.log("checkoutId", checkoutId);

      const queryAssociateCustomer = `
      mutation {
        checkoutCustomerAssociateV2(checkoutId: "${checkoutId}", customerAccessToken: "${savedToken}") {
          checkout {
            id
            webUrl
          }
          userErrors {
            message
          }
        }
      }
    `;

      const associateData = await api(queryAssociateCustomer);
      navigation.navigate("Checkout", {
        checkoutUrl:
          associateData.data.checkoutCustomerAssociateV2.checkout.webUrl,
        timestamp: new Date().getTime(),
      });
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  const deleteProduct = async (lineItemId: string) => {
    try {
      const query = `
      mutation {
        cartLinesRemove(
          cartId: "${cartID}",
          lineIds: ["${lineItemId}"]
        ) {
          cart {
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
          userErrors {
            field
            message
          }
        }
      }
            `;

      await api(query);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const changeQuantity = async (lineItemId: string, quantity: number) => {
    try {
      const query = `
      mutation {
        cartLinesUpdate(
          cartId: "${cartID}",
          lines: [{id: "${lineItemId}", quantity: ${quantity}}]
        ) {
          cart {
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
          userErrors {
            field
            message
          }
        }
      }
      `;

      await api(query);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <>
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
              <View style={styles.itemRight}>
                <Text style={styles.itemText}>
                  Total:{" "}
                  {(
                    item.node.quantity * item.node.merchandise.priceV2.amount
                  ).toFixed(2)}{" "}
                  {item.node.merchandise.priceV2.currencyCode}
                </Text>
                <Button
                  title="Remove"
                  onPress={() => deleteProduct(item.node.id)}
                />
                <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                  <Button
                    title="-"
                    onPress={() =>
                      changeQuantity(item.node.id, item.node.quantity - 1)
                    } // Decrementa la cantidad
                  />
                  <Button
                    title="+"
                    onPress={() =>
                      changeQuantity(item.node.id, item.node.quantity + 1)
                    } // Incrementa la cantidad
                  />
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>Loading...</Text>
        )}

        {/* <Text style={styles.totalAmount}>
            Total Amount: {cart.cart.cost.totalAmount.amount}{" "}
            {cart.cart.cost.totalAmount.currencyCode}
          </Text> */}

        <Button title="Checkout" onPress={() => goToCheckout()} />
      </>

      {/* // <Text>{JSON.stringify(cart)}</Text>
      // <Text style={styles.title}>Shopping Cart</Text>
      // {cart ? (
      //   cart.cart.lines.edges.map((item: any, index: any) => (
      //     <View key={index} style={styles.cartItem}>
      //       <View>
      //         <Text style={styles.itemText}>
      //           {item.node.merchandise.product.title}
      //         </Text>
      //         <Image
      //           source={{ uri: item.node.merchandise.image.originalSrc }}
      //           style={{ width: 50, height: 50 }}
      //         />
      //         <Text style={styles.itemSubText}>
      //           Quantity: {item.node.quantity}
      //         </Text>
      //       </View>
      //       <View style={styles.itemRight}>
      //         <Text style={styles.itemText}>
      //           Total:{" "}
      //           {(
      //             item.node.quantity * item.node.merchandise.priceV2.amount
      //           ).toFixed(2)}{" "}
      //           {item.node.merchandise.priceV2.currencyCode}
      //         </Text>
      //         <Button
      //           title="Remove"
      //           onPress={() => deleteProduct(item.node.id)}
      //         />
      //         <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
      //           <Button
      //             title="-"
      //             onPress={() =>
      //               changeQuantity(item.node.id, item.node.quantity - 1)
      //             } // Decrementa la cantidad
      //           />
      //           <Button
      //             title="+"
      //             onPress={() =>
      //               changeQuantity(item.node.id, item.node.quantity + 1)
      //             } // Incrementa la cantidad
      //           />
      //         </View>
      //       </View>
      //     </View>
      //   ))
      // ) : (
      //   <Text>Loading...</Text>
      // )}

      // <Text style={styles.totalAmount}>
      //   Total Amount: {cart.cart.cost.totalAmount.amount}{" "}
      //   {cart.cart.cost.totalAmount.currencyCode}
      // </Text>

      // <Button title="Checkout" onPress={() => goToCheckout()} /> */}
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
  itemRight: {
    alignItems: "flex-end",
  },
  removeButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});

export default Cart;
