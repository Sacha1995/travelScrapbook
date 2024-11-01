import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Dimensions } from "react-native";
import { ImageType } from "@/app/(tabs)/scrapbook";

interface ImageGalleryProps {
  images: ImageType[];
  onImagePress: (image: ImageType) => void;
}

export default function ImageGallery({
  images,
  onImagePress,
}: ImageGalleryProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => onImagePress(image)}>
          <View style={styles.imageWrapper}>
            <Image source={image.uri} style={styles.image} />
            {image.note ? (
              <Text style={styles.note} numberOfLines={1} ellipsizeMode="tail">
                {image.note}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 20 },
  imageWrapper: {
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
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 5,
    paddingHorizontal: 12,
    width: screenWidth * 0.8,
    maxWidth: 320,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    textAlign: "center",
    overflow: "hidden",
  },
});
