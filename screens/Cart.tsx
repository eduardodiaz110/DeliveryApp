import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  cartID: string | null;
  setCartID: React.Dispatch<React.SetStateAction<string | null>>;
}

const Cart: React.FC<Props> = ({ cartID, setCartID }) => {
  const [cart, setCart] = useState<any>(null);

  const goToCheckout = async () => {
    try {
      const shop = "quickstart-b6a433cb"; // reemplaza esto con el nombre de tu tienda
      const apiVersion = "2023-07"; // reemplaza esto con la versión de tu API
      const accessToken = "a8d6e2c263a5de4291a7b1d942df975b"; // reemplaza esto con tu token de acceso

      const response = await fetch(
        `https://${shop}.myshopify.com/api/${apiVersion}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": accessToken,
          },
          body: JSON.stringify({
            query: `
            query checkoutURL {
                cart(id: "gid://shopify/Cart/c1-d3f9ac7c37c49fa7aaaf73ac89304f42") {
                  checkoutUrl
                }
              }
              
          `,
          }),
        }
      );

      const data = await response.json();
      console.log(data.data.cart.checkoutUrl);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const retrieveCart = async () => {
      try {
        const shop = "quickstart-b6a433cb"; // reemplaza esto con el nombre de tu tienda
        const apiVersion = "2023-07"; // reemplaza esto con la versión de tu API
        const accessToken = "a8d6e2c263a5de4291a7b1d942df975b"; // reemplaza esto con tu token de acceso

        const response = await fetch(
          `https://${shop}.myshopify.com/api/${apiVersion}/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": accessToken,
            },
            body: JSON.stringify({
              query: `
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
            `,
            }),
          }
        );

        const data = await response.json();
        if (!data) {
          return <Text>Loading...</Text>;
        }

        setCart(data.data);
        console.log(cart);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    retrieveCart();
  }, [cartID]);

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
