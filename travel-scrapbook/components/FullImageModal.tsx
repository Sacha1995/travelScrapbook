import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import Box from "./restyle/Box";
import Text from "./restyle/Text";
import ThemedImage from "./restyle/Image";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import IconButton from "./IconButton";
import { useState } from "react";
import { useEffect } from "react";

interface FullImageModalProps {
  visible: boolean;
  image: { uri: string; note: string; date: string | Date } | null;
  onClose: () => void;
  onEdit: (newNote: string) => void;
  onDelete: () => void;
}

export default function FullImageModal({
  visible,
  image,
  onClose,
  onEdit,
  onDelete,
}: FullImageModalProps) {
  const [editedNote, setEditedNote] = useState<string>(image?.note || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (image) {
      setEditedNote(image.note || "Edit to add a note here.");
    }
  }, [image]);

  const handleSave = () => {
    onEdit(editedNote);
    setIsEditing(false);
  };

  const formattedDate = image?.date
    ? new Date(
        typeof image.date === "string" ? Date.parse(image.date) : image.date
      ).toLocaleDateString()
    : "Date not available";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="modalBackground"
      >
        <Box width="100%" alignItems="center">
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {image && (
              <>
                <Text
                  color="text"
                  alignSelf="flex-start"
                  paddingLeft="l"
                  paddingTop="s"
                >
                  {formattedDate}
                </Text>
                <ThemedImage
                  source={{ uri: image.uri }}
                  width="90%"
                  aspectRatio={3 / 4}
                  borderRadius={18}
                  marginBottom="l"
                  marginTop="l"
                />
                {isEditing ? (
                  <TextInput
                    style={styles.noteInput}
                    value={editedNote}
                    onChangeText={setEditedNote}
                    placeholderTextColor="#fff"
                    multiline
                  />
                ) : (
                  <Text style={styles.note}>{editedNote}</Text>
                )}
              </>
            )}
            <View style={styles.buttonContainer}>
              <IconButton
                iconName="delete"
                onPress={onDelete}
                color="red"
                size={32}
              />
              {isEditing ? (
                <IconButton
                  iconName="check"
                  onPress={handleSave}
                  color="#ffd33d"
                  size={32}
                />
              ) : (
                <IconButton
                  iconName="edit"
                  onPress={() => setIsEditing(true)} // Enable editing mode
                  color="#ffd33d"
                  size={32}
                />
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={32} color="#ffd33d" />
            </TouchableOpacity>
          </ScrollView>
        </Box>
      </Box>
    </Modal>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  content: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#25292e",
    borderRadius: 10,
    width: screenWidth * 0.9,
    maxWidth: 400,
    marginTop: 20,
    marginBottom: 20,
  },
  note: {
    color: "#fff",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    width: "90%",
  },
  noteInput: {
    color: "#fff",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    width: "90%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  closeButton: { position: "absolute", top: 10, right: 10 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#ffd33d",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
