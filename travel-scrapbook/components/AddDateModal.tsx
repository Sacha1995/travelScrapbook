// AddDateModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AddDateModalProps {
  visible: boolean;
  date: Date;
  onChangeDate: (date: Date) => void;
  onSave: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function AddDateModal({
  visible,
  date,
  onChangeDate,
  onSave,
  onSkip,
  onClose,
}: AddDateModalProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowPicker(false);
    if (selectedDate) {
      onChangeDate(selectedDate);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add a Date</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {date ? date.toLocaleDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
              <Text style={styles.buttonText}>Skip Date</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#25292e",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  title: { color: "#ffd33d", fontSize: 18, marginBottom: 10 },
  datePickerButton: {
    borderColor: "#ffd33d",
    borderWidth: 1,
    padding: 10,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  datePickerText: { color: "#fff" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  saveButton: { backgroundColor: "#ffd33d", padding: 10, borderRadius: 8 },
  skipButton: { backgroundColor: "#555", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff" },
});
