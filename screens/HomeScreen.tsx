import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Products } from "../modules/Products";

interface Props {
  cartID: string | null;
  setCartID: React.Dispatch<React.SetStateAction<string | null>>;
}

const HomeScreen: React.FC<Props> = ({ cartID, setCartID }) => {
  const [products, setProducts] = useState<Products | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
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
                products(first:10) {
                  edges {
                    node {
                      title
                      description
                      images(first: 1) {
                        edges {
                          node {
                            originalSrc
                          }
                        }
                      }
                      variants(first: 1) {
                        edges {
                          node {
                            id
                            priceV2 {
                              amount
                              currencyCode
                            }
                          }
                        }
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
        setProducts(data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (variantId: string) => {
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
                    countryCode: CA,
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
        
          `,
          }),
        }
      );

      const data = await response.json();
      setCartID(data.data.cartCreate.cart.id);
    } catch (error) {
      console.error("Error fetching products:", error);
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
