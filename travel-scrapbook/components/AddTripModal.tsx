import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

interface AddTripProps {
  isModalVisible: boolean;
  addNewTrip: () => void;
  setIsModalVisible: (visible: boolean) => void;
  setNewTripName: (name: string) => void;
  newTripName: string;
}

const AddTripModal = ({
  isModalVisible,
  addNewTrip,
  setIsModalVisible,
  setNewTripName,
  newTripName,
}: AddTripProps) => {
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter trip name</Text>
          <TextInput
            style={styles.input}
            value={newTripName}
            onChangeText={setNewTripName}
            placeholder="Trip Name"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.button}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={addNewTrip}>
              <Text style={styles.button}>Add Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#ffd33d",
    paddingVertical: 4,
    width: 120,
    textAlign: "center",
    borderRadius: 10,
  },
});

export default AddTripModal;
