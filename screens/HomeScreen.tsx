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
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Products } from "../modules/Products";
import { api } from "../functions/api";
import ProductModal from "./modals/ProductModal";

interface Props {
  cartID: string | null;
  setCartID: React.Dispatch<React.SetStateAction<string | null>>;
  products: Products | null;
  categories: any;
}

const HomeScreen: React.FC<Props> = ({
  cartID,
  setCartID,
  products,
  categories,
}) => {
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

  const filteredProducts =
    products?.edges.filter(({ node }: any) => {
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
    <ScrollView>
      <View>
        <TextInput // Campo de búsqueda
          style={styles.input}
          placeholder="Buscar productos..."
          value={searchTerm}
          onChangeText={(text) => handleSearchChange(text)}
        />
        {/* Deslizador de Categorías */}
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                item === selectedCategory && styles.selectedCategory,
              ]} // Estilo diferente para categoría seleccionada
              onPress={() => handleCategorySelect(item)} // Manejar selección de categoría
            >
              <Text style={styles.categoryButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ProductModal
          productData={productData}
          setModalVisible={setModalVisible}
          cartID={cartID}
          setCartID={setCartID}
        />
      </Modal>

      {filteredProducts &&
        filteredProducts.map(({ node }: any) => (
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
            <Button title="View Product" onPress={() => viewProduct(node)} />
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
