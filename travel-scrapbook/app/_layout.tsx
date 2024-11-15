import { Stack } from "expo-router";
import { View, StyleSheet, Modal, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import AddTripModal from "@/components/AddTripModal";
import useTripsStore from "@/src/useTripsStore";
import IconButton from "@/components/IconButton";
import { ThemeProvider } from "@shopify/restyle";
import Theme from "@/theme/theme";

const RootLayout = () => {
  const { trips, selectedTrip, setTrips, addTrip, updateSelectedTrip } =
    useTripsStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false); // State to control confirmation modal
  const [newTripName, setNewTripName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const savedTrips = await AsyncStorage.getItem("trips");
        const parsedTrips = savedTrips ? JSON.parse(savedTrips) : {};
        setTrips(parsedTrips);

        if (Object.keys(parsedTrips).length > 0) {
          updateSelectedTrip(Object.keys(parsedTrips)[0]);
        } else {
          setIsModalVisible(true);
        }
      } catch (error) {
        console.error("Failed to load trips", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [setTrips, updateSelectedTrip]);

  const addNewTrip = async () => {
    if (newTripName.trim()) {
      const updatedTrips = { ...trips, [newTripName]: [] };
      await AsyncStorage.setItem("trips", JSON.stringify(updatedTrips));
      addTrip(newTripName);
      setNewTripName("");
      setIsModalVisible(false);
    }
  };

  const updateTrip = (tripName: string) => {
    if (tripName === "addNewTrip") {
      setIsModalVisible(true);
    } else {
      updateSelectedTrip(tripName);
    }
  };

  if (loading) {
    return <View style={{ flex: 1 }} />;
  }

  const handleDeleteTrip = async () => {
    if (selectedTrip && trips[selectedTrip]) {
      const updatedTrips = { ...trips };
      delete updatedTrips[selectedTrip];
      await AsyncStorage.setItem("trips", JSON.stringify(updatedTrips));
      setTrips(updatedTrips);
      updateSelectedTrip(Object.keys(updatedTrips)[0] || "");
    }
    setIsConfirmDeleteVisible(false);
  };

  const cancelDelete = () => {
    setIsConfirmDeleteVisible(false);
  };

  return (
    <ThemeProvider theme={Theme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            initialParams={{
              selectedTrip: selectedTrip || "",
              trips: trips || {},
            }}
            options={{
              headerTitle: () => (
                <View style={styles.pickerContainer}>
                  {selectedTrip && (
                    <IconButton
                      iconName="delete"
                      onPress={() => setIsConfirmDeleteVisible(true)}
                      color="red"
                      size={32}
                    />
                  )}
                  <Picker
                    selectedValue={selectedTrip}
                    onValueChange={updateTrip}
                    style={styles.picker}
                  >
                    {Object.keys(trips).map((trip) => (
                      <Picker.Item label={trip} value={trip} key={trip} />
                    ))}
                    <Picker.Item label="Add New Trip" value="addNewTrip" />
                  </Picker>
                </View>
              ),
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <AddTripModal
          isModalVisible={isModalVisible}
          addNewTrip={addNewTrip}
          setIsModalVisible={setIsModalVisible}
          setNewTripName={setNewTripName}
          newTripName={newTripName}
        />
        {/* Confirmation Modal for Deleting Trip */}
        <Modal
          transparent={true}
          visible={isConfirmDeleteVisible}
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Are you sure you want to delete this trip?
              </Text>
              <View style={styles.modalButtonsContainer}>
                <Button title="Cancel" onPress={cancelDelete} />
                <Button
                  title="Yes, Delete"
                  color="red"
                  onPress={handleDeleteTrip}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ThemeProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  picker: {
    width: 200,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
