import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import CircleButton from "@/components/CircleButton";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageGallery from "@/components/ImageGallery";
import AddNoteModal from "@/components/AddNoteModal";
import FullImageModal from "@/components/FullImageModal";

interface ImageType {
  uri: string;
  note: string;
}

export default function AboutScreen() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [note, setNote] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [newImage, setNewImage] = useState<ImageType | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const savedImages = await AsyncStorage.getItem("images");
      if (savedImages) setImages(JSON.parse(savedImages));
    } catch (error) {
      console.error("Failed to load images", error);
    }
  };

  const saveImages = async (newImages: ImageType[]) => {
    try {
      await AsyncStorage.setItem("images", JSON.stringify(newImages));
      setImages(newImages);
    } catch (error) {
      console.error("Failed to save images", error);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setNewImage({ uri: result.assets[0].uri, note: "" });
      setIsModalVisible(true);
    }
  };

  const saveNote = () => {
    if (newImage) {
      const newMemory = { ...newImage, note };
      const updatedImages = [...images, newMemory];
      saveImages(updatedImages);
      setNote("");
      setIsModalVisible(false);
      setSelectedImage(null);
    }
  };

  const handleSkipNote = () => {
    if (newImage) {
      const newMemory = { ...newImage, note: "" };
      const updatedImages = [...images, newMemory];
      saveImages(updatedImages);
      setIsModalVisible(false);
      setSelectedImage(null);
    }
  };

  const handleEditNote = (newNote: string) => {
    if (selectedImage) {
      const updatedImages = images.map((image) =>
        image.uri === selectedImage.uri ? { ...image, note: newNote } : image
      );
      saveImages(updatedImages);
    }
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      const updatedImages = images.filter(
        (img) => img.uri !== selectedImage.uri
      );
      saveImages(updatedImages);
      setSelectedImage(null);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {images.length > 0 ? (
        <ImageGallery
          images={images}
          onImagePress={(image: ImageType) => setSelectedImage(image)}
        />
      ) : (
        <Text style={styles.text}>Add an image</Text>
      )}

      <AddNoteModal
        visible={isModalVisible}
        note={note}
        onChangeNote={setNote}
        onSave={saveNote}
        onSkip={handleSkipNote}
        onClose={() => setIsModalVisible(false)}
      />

      <FullImageModal
        visible={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onEdit={handleEditNote}
        onDelete={handleDeleteImage}
      />

      <View style={styles.circleButton}>
        <CircleButton onPress={pickImageAsync} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#25292e" },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  text: { color: "#fff" },
  circleButton: { position: "absolute", bottom: 10, right: -50 },
});
