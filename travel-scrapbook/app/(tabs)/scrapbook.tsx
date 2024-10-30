import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import CircleButton from "@/components/CircleButton";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

export default function AboutScreen() {
  const [images, setImages] = useState<{ uri: string; note: string }[]>([]);
  const [note, setNote] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    note: string;
  } | null>(null);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>(
    undefined
  );
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
      setIsModalVisible(true); // Open modal to add note
    } else {
      alert("You did not select any image.");
    }
  };

  const saveNote = (skip = false) => {
    if (selectedImageUri) {
      setImages((prevImages) => [
        ...prevImages,
        { uri: selectedImageUri, note: skip ? "" : note },
      ]);
      setNote("");
      setSelectedImageUri(undefined);
      setIsModalVisible(false);
    }
  };

  const openNoteModal = (image) => {
    setSelectedImage(image);
    setIsNoteModalVisible(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.imageContainer}
          showsVerticalScrollIndicator={false}
        >
          {images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => openNoteModal(image)}>
              <View style={styles.imageWrapper}>
                <Image source={image.uri} style={styles.image} />
                <Text
                  style={image.note === "" ? null : styles.note}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {image.note || ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.text}>Add an image</Text>
      )}

      {/* Modal for adding a note */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a note for your image</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your note here"
              placeholderTextColor="#888"
              value={note}
              onChangeText={setNote}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => saveNote(false)}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Save Note</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => saveNote(true)}
                style={styles.skipButton}
              >
                <Text style={styles.buttonText}>Skip Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for viewing the full image and note */}
      <Modal
        visible={isNoteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.fullModalContainer}>
          <View style={styles.fullModalContent}>
            {selectedImage && (
              <>
                <Image source={selectedImage.uri} style={styles.fullImage} />
                {selectedImage.note === "" ? (
                  ""
                ) : (
                  <Text style={styles.fullNote}>{selectedImage.note}</Text>
                )}
              </>
            )}
            <TouchableOpacity
              onPress={closeNoteModal}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" style={styles.closeButtonText} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.circleButton}>
        <CircleButton onPress={pickImageAsync} />
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  circleButton: {
    position: "absolute",
    bottom: 10,
    right: -50,
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: screenWidth * 0.8,
    maxWidth: 320,
    aspectRatio: 3 / 4,
    borderRadius: 18,
    margin: 10,
  },
  note: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    color: "#fff",
    fontSize: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    textAlign: "center",
  },
  input: {
    borderColor: "#ffd33d",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: "90%",
    color: "#fff",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#25292e",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    color: "#ffd33d",
    fontSize: 18,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  skipButton: {
    backgroundColor: "#555",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  fullModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  fullModalContent: {
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#25292e",
    borderRadius: 10,
  },
  fullImage: {
    width: screenWidth * 0.8,
    maxWidth: 300,
    aspectRatio: 3 / 4,
    borderRadius: 18,
    marginBottom: 20,
  },
  fullNote: {
    color: "#fff",
    fontSize: 16,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  closeButtonText: {
    color: "#ffd33d",
    fontSize: 42,
  },
});
