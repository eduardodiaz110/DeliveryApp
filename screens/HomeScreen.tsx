import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Products } from "../modules/Products";
import { api } from "../functions/api";

interface Props {
  cartID: string | null;
  setCartID: React.Dispatch<React.SetStateAction<string | null>>;
  products: Products | null;
}

const HomeScreen: React.FC<Props> = ({ cartID, setCartID, products }) => {
  const addToCart = async (variantId: string) => {
    try {
      if (!cartID) {
        const query = `
        mutation {
          cartCreate(
            input: {
              lines: [
                {
                  quantity: 1
                  merchandiseId: "${variantId}"
                }
              ],
              buyerIdentity: {
                email: "example@example.com",
                countryCode: MX,
                deliveryAddressPreferences: {
                  deliveryAddress: {
                    address1: "150 Elgin Street",
                    address2: "8th Floor",
                    city: "Ottawa",
                    province: "Ontario",
                    country: "CA",
                    zip: "K2P 1L4"
                  }
                }
              },
              attributes: {
                key: "cart_attribute",
                value: "This is a cart attribute"
              }
            }
          ) {
            cart {
              id
              createdAt
              updatedAt
              lines(first: 10) {
                edges {
                  node {
                    id
                    merchandise {
                      ... on ProductVariant {
                        id
                      }
                    }
                  }
                }
              }
              buyerIdentity {
                deliveryAddressPreferences {
                  __typename
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
            }
          }
        }
    
      `;
        const data = await api(query);
        setCartID(data.data.cartCreate.cart.id);
      } else {
        const query = `
        mutation {
          cartLinesAdd(
            cartId: "${cartID}",
            lines: [
              {
                quantity: 1
                merchandiseId: "${variantId}"
              }
            ]
          ) 
          {
            cart {
              id
              createdAt
              updatedAt
              lines(first: 10) {
                edges {
                  node {
                    id
                    merchandise {
                      ... on ProductVariant {
                        id
                      }
                    }
                  }
                }
              }
              buyerIdentity {
                deliveryAddressPreferences {
                  __typename
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
            }
          }
        }
      `;
        const data = await api(query);
        setCartID(data.data.cartLinesAdd.cart.id);
      }
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {products &&
        products.edges.map(({ node }: any) => (
          <View key={node.title} style={styles.product}>
            <Text>{node.title}</Text>
            <Text>{node.description}</Text>
            {node.images.edges.length > 0 && (
              <Image
                source={{ uri: node.images.edges[0].node.originalSrc }}
                style={styles.image}
              />
            )}
            {node.variants.edges.length > 0 && (
              <Text>
                {node.variants.edges[0].node.priceV2.amount}{" "}
                {node.variants.edges[0].node.priceV2.currencyCode}
              </Text>
            )}
            <Button
              title="Add to Cart"
              onPress={() => addToCart(node.variants.edges[0].node.id)}
            />
          </View>
        ))}
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  product: {
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;
