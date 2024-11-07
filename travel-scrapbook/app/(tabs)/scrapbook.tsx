import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import CircleButton from "@/components/CircleButton";
import * as ImagePicker from "expo-image-picker";
import ImageGallery from "@/components/ImageGallery";
import AddNoteModal from "@/components/AddNoteModal";
import FullImageModal from "@/components/FullImageModal";
import AddDateModal from "@/components/AddDateModal";
import useTripsStore from "@/src/useTripsStore";

export interface ImageType {
  uri: string;
  note: string;
  date: string | Date;
}

export default function AboutScreen() {
  const { trips, selectedTrip, setImagesForTrip } = useTripsStore();
  const [images, setImages] = useState<ImageType[]>([]);
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [isNoteModalVisible, setIsNoteModalVisible] = useState<boolean>(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [newImage, setNewImage] = useState<ImageType | null>(null);

  // Load images whenever the selectedTrip changes
  useEffect(() => {
    if (selectedTrip && trips[selectedTrip]) {
      setImages(trips[selectedTrip]);
    } else {
      setImages([]); // Reset images if no selected trip or trip is empty
    }
  }, [selectedTrip, trips]);

  const saveImages = (newImages: ImageType[]) => {
    setImagesForTrip(selectedTrip, newImages); // Use Zustand action
    setImages(newImages);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setNewImage({ uri: result.assets[0].uri, note: "", date: new Date() });
      setIsNoteModalVisible(true);
    }
  };

  const saveNote = () => {
    if (newImage) {
      const updatedImage = { ...newImage, note };
      setNewImage(updatedImage);
      setNote("");
      setIsNoteModalVisible(false);
      setIsDateModalVisible(true);
    }
  };

  const handleSkipNote = () => {
    if (newImage) {
      const updatedImage = { ...newImage, note: "" };
      setNewImage(updatedImage);
      setIsNoteModalVisible(false);
      setIsDateModalVisible(true);
    }
  };

  const saveDate = () => {
    if (newImage) {
      const finalImage = { ...newImage, date };
      const updatedImages = [...images, finalImage];
      saveImages(updatedImages);
      setNewImage(null);
      setDate(new Date());
      setIsDateModalVisible(false);
    }
  };

  const handleSkipDate = () => {
    setIsDateModalVisible(false);
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

  if (!trips || Object.keys(trips).length === 0) {
    return <Text>No trips available. Please add a trip.</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          images.length === 0 && styles.centerText,
        ]}
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
          visible={isNoteModalVisible}
          note={note}
          onChangeNote={setNote}
          onSave={saveNote}
          onSkip={handleSkipNote}
          onClose={() => setIsNoteModalVisible(false)}
        />

        <AddDateModal
          visible={isDateModalVisible}
          date={date}
          onChangeDate={setDate}
          onSave={saveDate}
          onSkip={handleSkipDate}
          onClose={() => setIsDateModalVisible(false)}
        />

        <FullImageModal
          visible={!!selectedImage}
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onEdit={handleEditNote}
          onDelete={handleDeleteImage}
        />
      </ScrollView>
      <View style={styles.circleButton}>
        <CircleButton onPress={pickImageAsync} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#25292e", position: "relative" },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  centerText: {
    justifyContent: "center",
  },
  text: { color: "#fff", justifyContent: "center" },
  circleButton: { position: "absolute", bottom: 10, right: -50 },
});
