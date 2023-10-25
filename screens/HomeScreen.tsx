import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Products } from "../modules/Products";
import { api } from "../functions/api";
import ProductModal from "./modals/ProductModal";
import { globalStyles } from "../theme";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { RootDrawerParamList } from "../modules/DrawerNavigatorModule";
import { RootStackParams, ShopStackParams } from "../Navigator";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../AppContext";

export type Props = {
  route: StackScreenProps<ShopStackParams, "HomeScreen">["route"];
};

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ShopStackParams>>();

  const { products, cartID, cursor, setCartID, setCursor } =
    React.useContext(AppContext);

  const [homeScreenProducts, setHomeScreenProducts] = useState<Products | null>(
    null
  );
  useEffect(() => {
    setHomeScreenProducts(products);
  }, [products]);

  const [modalVisible, setModalVisible] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
      setSearchTerm("");
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    setSelectedCategory("");
  };

  const viewProduct = async (selectedProduct: any) => {
    setModalVisible(true);
    setProductData(selectedProduct);
  };

  const loadMoreProducts = async () => {
    try {
      const query = `
            {
              products(first:20) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
      
                edges {
                  node {
                    title
                    description
                    collections(first: 10) {
                      edges {
                        node {
                          title
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          originalSrc
                        }
                      }
                    }
                    variants(first: 10) {
                      edges {
                        node {
                          id
                          title
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
          `;
      const data = await api(query);
      // Actualizar tus productos y el cursor de paginación
      console.log(`data_ ${JSON.stringify(data)}`);
      setHomeScreenProducts(data.data.products);
      setCursor(data.data.products.pageInfo.endCursor);
    } catch (error) {
      console.error("Error cargando más productos:", error);
    }
  };

  const filteredProducts =
    homeScreenProducts?.edges.filter(({ node }: any) => {
      if (searchTerm && !selectedCategory) {
        return node.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (selectedCategory && !searchTerm) {
        return node.collections.edges.some(
          (collectionEdge: any) =>
            collectionEdge.node.title === selectedCategory
        );
      } else if (searchTerm && selectedCategory) {
        return (
          node.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          node.collections.edges.some(
            (collectionEdge: any) =>
              collectionEdge.node.title === selectedCategory
          )
        );
      }
      return true;
    }) || [];

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Image
        style={{ width: "100%", height: 150 }}
        source={{
          uri: "https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2016/07/13104420/shutterstock_256525987-1024x575.jpg",
        }}
      />

      {/*Intro text*/}
      <View style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 15 }}>
        <Text style={{ fontSize: 35, fontWeight: "700" }}>Snowboard Shop</Text>
        <Text style={{ fontSize: 19, fontWeight: "400", paddingTop: 9 }}>
          A famous snowboard shop establish in 1999.
        </Text>
        <View style={{ paddingTop: 25, paddingBottom: 25 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 10,
            }}
          >
            <FontAwesome name="snowflake-o" size={24} color="#ff8600" />
            <Text style={{ paddingLeft: 10, fontSize: 16, fontWeight: "400" }}>
              Exclusive Winter Collection
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 0,
            }}
          >
            <MaterialCommunityIcons
              name="truck-fast"
              size={24}
              color="#ff8600"
            />
            <Text style={{ paddingLeft: 10, fontSize: 16, fontWeight: "400" }}>
              Fast Worldwide Shipping
            </Text>
          </View>
          <Text style={{ paddingLeft: 34, color: "grey" }}>
            In All Languages
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 10,
            }}
          >
            <Ionicons name="md-help-buoy" size={24} color="#ff8600" />
            <Text style={{ paddingLeft: 10, fontSize: 16, fontWeight: "400" }}>
              24/7 Customer Support
            </Text>
          </View>
        </View>
      </View>

      {/*Search bar and categories*/}
      {/* <View className="py-3">
        <TextInput // Campo de búsqueda
          style={globalStyles.searchBar_1}
          placeholder="Buscar productos..."
          placeholderTextColor={"#66514a"}
          value={searchTerm}
          onChangeText={(text) => handleSearchChange(text)}
        />
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                globalStyles.textButton_1_active,
                item === selectedCategory && styles.selectedCategory,
              ]} // Estilo diferente para categoría seleccionada
              onPress={() => handleCategorySelect(item)} // Manejar selección de categoría
            >
              <Text style={globalStyles.textButton_1_active_text}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View> */}

      <View style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 10 }}>
        <Text
          style={{
            fontSize: 25,
            color: "#000",
            fontWeight: "800",
            paddingBottom: 20,
          }}
        >
          🔥 Popular Items
        </Text>
      </View>

      {/*Modal*/}
      {/* <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ProductModal
          productData={productData}
          setModalVisible={setModalVisible}
          cartID={cartID}
          setCartID={setCartID}
        />
      </Modal> */}

      {/*Products*/}

      <View
        style={{
          paddingRight: 12,
          paddingLeft: 12,
        }}
      >
        {filteredProducts.map(({ node }: any) => (
          <TouchableOpacity
            key={node.title}
            style={{
              padding: 12,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopWidth: 0.5,
              borderRadius: 5,

              borderColor: "#ffd9ce",
            }}
            onPress={() =>
              navigation.navigate("ProductScreen", { productData: node })
            }
          >
            <View style={{ width: "60%" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {node.title}
              </Text>
              <Text>{node.description}</Text>
              {node.variants.edges.length > 0 && (
                <Text
                  style={{
                    color: "#f95222",
                    fontSize: 16,
                    fontWeight: "800",
                  }}
                >
                  $ {node.variants.edges[0].node.priceV2.amount}{" "}
                  {node.variants.edges[0].node.priceV2.currencyCode}
                </Text>
              )}
            </View>
            <View>
              {node.images.edges.length > 0 && (
                <Image
                  source={{ uri: node.images.edges[0].node.originalSrc }}
                  style={styles.image}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {/* <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.node.title}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          marginLeft: 6,
          marginRight: 6,
          rowGap: 10,
        }}
        numColumns={2}
        centerContent={true}
        renderItem={({ item }) => (
          <View key={item.node.title} style={globalStyles.itemContainer_1}>
            <Text>{item.node.title}</Text>
            <Text>{item.node.description}</Text>
            {item.node.images.edges.length > 0 && (
              <Image
                source={{ uri: item.node.images.edges[0].node.originalSrc }}
                style={styles.image}
              />
            )}
            {item.node.variants.edges.length > 0 && (
              <Text>
                {item.node.variants.edges[0].node.priceV2.amount}{" "}
                {item.node.variants.edges[0].node.priceV2.currencyCode}
              </Text>
            )}
            <Button
              title="View Product"
              onPress={() => viewProduct(item.node)}
            />
          </View>
        )}
        onEndReached={loadMoreProducts}
      /> */}

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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  categoryButton: {
    backgroundColor: "skyblue",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  categoryButtonText: {
    color: "white",
  },
  selectedCategory: {
    backgroundColor: "dodgerblue", // Color diferente para categoría seleccionada
  },
});

export default HomeScreen;
