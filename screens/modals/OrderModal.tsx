import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Order({
  orderData,
  setModalVisible,
  modalVisible,
}: {
  orderData: any;
  setModalVisible: any;
  modalVisible: boolean;
}) {
  const { node } = orderData;
  const { processedAt, totalPriceV2 } = node;
  const { amount, currencyCode } = totalPriceV2;

  const moveAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const currentTime = new Date();
    const processedTime = new Date(processedAt);
    const endTime = new Date(processedTime.getTime() + 12 * 60 * 1000); // Add 10 minutes
    const duration = 6000;
    console.log(duration);

    if (duration > 0) {
      Animated.timing(moveAnim, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      moveAnim.setValue(100); // You might need to adjust this value
    }
  }, []);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Detalles de la Orden</Text>

            <Text style={styles.text}>
              Total: {amount} {currencyCode}
            </Text>
            <View style={styles.line}></View>
            <View style={styles.lineContainer}>
              <View style={styles.line}></View>
              <Animated.View
                style={{
                  position: "absolute",
                  left: 0,
                  transform: [
                    {
                      translateX: moveAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 100],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons name="ios-car-sport-sharp" size={32} color="green" />
              </Animated.View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  lineContainer: {
    width: 100,
    height: 32, // or whatever height you want
    position: "relative",
    overflow: "visible", // Make sure the animated icon is visible outside the container
  },
  line: {
    height: 2,
    backgroundColor: "black",
    width: "100%", // Use 100% of the container width
    position: "absolute",
    bottom: 0, // Align to the bottom of the container
  },
});
