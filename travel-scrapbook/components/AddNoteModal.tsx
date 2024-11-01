import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface AddNoteModalProps {
  visible: boolean;
  note: string;
  onChangeNote: (text: string) => void;
  onSave: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function AddNoteModal({
  visible,
  note,
  onChangeNote,
  onSave,
  onSkip,
  onClose,
}: AddNoteModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add a Note</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={onChangeNote}
            placeholder="Type your note"
            placeholderTextColor="#fff"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
              <Text style={styles.buttonText}>Skip Note</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save Note</Text>
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
  input: {
    borderColor: "#ffd33d",
    borderWidth: 1,
    padding: 10,
    width: "90%",
    color: "#fff",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  saveButton: { backgroundColor: "#ffd33d", padding: 10, borderRadius: 8 },
  skipButton: { backgroundColor: "#555", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff" },
});
