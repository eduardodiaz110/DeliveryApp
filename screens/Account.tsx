import React, { useEffect, useState } from "react";
import { Button, View, Text, FlatList, StyleSheet, Modal } from "react-native";
import { api } from "../functions/api";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../auth/AuthContext";
import OrderModal from "./modals/OrderModal";

type CartProps = {
  setCartID: React.Dispatch<React.SetStateAction<string | null>>;
};

const Account: React.FC<CartProps> = ({ setCartID }) => {
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [orderData, setOrderDatatOrders] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  //fetch Orders
  useFocusEffect(() => {
    const fetchOrders = async () => {
      const savedToken = await SecureStore.getItemAsync("userToken");

      if (!savedToken) {
        return;
      }
      const query = `
          {
            customer(customerAccessToken:"${savedToken}") {
              orders(first: 10) { 
                edges {
                  node {
                    id
                    orderNumber
                    totalPriceV2 {
                      amount
                      currencyCode
                    }
                    processedAt
                  }
                }
              }
            }
          }
        `;

      try {
        const result = await api(query);
        setOrders(result.data.customer.orders.edges);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  });

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      setIsAuthenticated(false);
      setCartID(null);
    } catch (error) {
      console.log(error);
    }
  };

  const viewOrder = async (selectedOrder: any) => {
    setModalVisible(true);
    setOrderDatatOrders(selectedOrder);
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <OrderModal
          orderData={orderData}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
        />
      </Modal>

      <Text style={styles.title}>Account</Text>

      {orders ? (
        orders.map((order: any) => (
          <View key={order.node.id} style={styles.orderContainer}>
            <Text style={styles.orderNumber}>
              Order Number: {order.node.orderNumber}
            </Text>
            <Text style={styles.orderDetail}>
              Total: {order.node.totalPriceV2.amount}{" "}
              {order.node.totalPriceV2.currencyCode}
            </Text>
            <Text style={styles.orderDetail}>
              Processed At: {order.node.processedAt}
            </Text>
            <Button title="View Order" onPress={() => viewOrder(order)} />
          </View>
        ))
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}

      <Button
        title="Logout"
        onPress={handleLogout}
        color="#841584" // Puedes cambiar este color por el que prefieras
      />
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4", // Color de fondo general
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Color del título
  },
  loading: {
    fontSize: 18,
    color: "#888", // Color del texto de carga
  },
  orderContainer: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff", // Color de fondo de cada orden
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222", // Color del número de orden
  },
  orderDetail: {
    fontSize: 16,
    color: "#555", // Color de los detalles de la
  },
});
