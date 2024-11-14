import React, { useState } from "react";
import { TextInput, Button, View, StyleSheet, Text, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { OPENCAGE_API_KEY } from "@env";
import AddNoteModal from "@/components/AddNoteModal";
import AddDateModal from "@/components/AddDateModal";
import useTripsStore from "@/src/useTripsStore";
import { useEffect } from "react";
import ExpoImage from "expo-image/build/ExpoImage";

type Coordinates = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};

type ImageType = {
  uri: string;
  note: string;
  date: string | Date;
  coordinates?: Coordinates;
};

export default function Index() {
  const { selectedTrip, setImagesForTrip, setCoordinatesForTrip, trips } =
    useTripsStore();
  const trip = trips[selectedTrip] || { images: [], coordinates: undefined };
  const tripCoordinates = trip.coordinates;
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState("");
  const [markers, setMarkers] = useState<ImageType[]>(trip.images);
  const [newImage, setNewImage] = useState<ImageType | null>(null);
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<Date | string>(new Date());
  const [isNoteModalVisible, setIsNoteModalVisible] = useState<boolean>(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (tripCoordinates) {
      setCoordinates({
        latitude: tripCoordinates.latitude,
        longitude: tripCoordinates.longitude,
        latitudeDelta: tripCoordinates.latitudeDelta || 0.1,
        longitudeDelta: tripCoordinates.longitudeDelta || 0.1,
      });
    }
  }, [selectedTrip, tripCoordinates]);

  useEffect(() => {
    if (trips[selectedTrip]) {
      setMarkers(trips[selectedTrip].images);
    }
  }, [selectedTrip, trips]);

  // Function to get coordinates using HERE Geocoding API
  const getCoordinates = async (locationName: string) => {
    try {
      const apiKey = OPENCAGE_API_KEY;
      const url = `https://geocode.search.hereapi.com/v1/geocode?q=${locationName}&apiKey=${apiKey}`;

      const response = await axios.get(url);
      const items = response.data.items;

      if (items.length > 0) {
        const { lat, lng } = items[0].position;
        setCoordinates({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
        setError("");
      } else {
        setError("Location not found.");
        setCoordinates(null);
      }
    } catch (error: any) {
      console.error("API Fetch Error:", error);
      setError(error.response?.data?.message || "Error fetching location.");
    }
  };

  const handleConfirmLocation = () => {
    if (coordinates) {
      setCoordinatesForTrip(selectedTrip, coordinates);
    }
  };

  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    setCoordinates({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });

    // Open the image picker when a location is selected
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage: ImageType = {
        uri: result.assets[0].uri,
        note: "",
        date: new Date(),
        coordinates: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        },
      };
      setNewImage(selectedImage);
      setIsNoteModalVisible(true); // Open modal to add a note
    }
  };

  // Save note and proceed to the date modal
  const saveNote = () => {
    if (newImage) {
      const updatedImage = { ...newImage, note };
      setNewImage(updatedImage);
      setNote("");
      setIsNoteModalVisible(false);
      setIsDateModalVisible(true);
    }
  };

  // Save date and update trip's images
  const saveDate = () => {
    if (newImage) {
      const finalImage = { ...newImage, date };
      const updatedMarkers = [...trip.images, finalImage];
      setMarkers(updatedMarkers);
      setImagesForTrip(selectedTrip, updatedMarkers);
      setNewImage(null);
      setDate(new Date());
      setIsDateModalVisible(false);
    }
  };

  // Skip note and go to date modal
  const handleSkipNote = () => {
    if (newImage) {
      const updatedImage = { ...newImage, note: "" };
      setNewImage(updatedImage);
      setIsNoteModalVisible(false);
      setIsDateModalVisible(true);
    }
  };

  const handleSkipDate = () => {
    if (newImage) {
      const updatedImage = { ...newImage, date: new Date() };
      const updatedMarkers = [...trip.images, updatedImage];
      setMarkers(updatedMarkers);
      setImagesForTrip(selectedTrip, updatedMarkers);
      setNewImage(null);
      setIsDateModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {!tripCoordinates ? (
        <>
          <Text style={styles.text}>
            Enter the country or city you are visiting:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Country or City"
            value={location}
            onChangeText={setLocation}
          />
          <Button title="Search" onPress={() => getCoordinates(location)} />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {coordinates && (
            <View>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.mapChoose}
                  region={coordinates}
                  onRegionChangeComplete={(region) => setCoordinates(region)}
                ></MapView>
              </View>
              <Button
                title="Confirm Map"
                onPress={handleConfirmLocation} // Save coordinates to store when confirmed
              />
            </View>
          )}
        </>
      ) : (
        <View>
          <Text style={styles.text}>Picture location:</Text>
          <TextInput
            style={styles.input}
            placeholder="Search for a new location"
            value={location}
            onChangeText={setLocation}
            onSubmitEditing={() => getCoordinates(location)}
          />
          <MapView
            style={styles.map}
            region={
              coordinates
                ? {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    latitudeDelta: coordinates.latitudeDelta || 0.1,
                    longitudeDelta: coordinates.longitudeDelta || 0.1,
                  }
                : {
                    latitude: tripCoordinates.latitude,
                    longitude: tripCoordinates.longitude,
                    latitudeDelta: tripCoordinates.latitudeDelta,
                    longitudeDelta: tripCoordinates.longitudeDelta,
                  }
            }
            onPress={handleMapPress}
          >
            {markers.length > 0 &&
              markers.map((marker, index) => {
                // Only render the Marker if the coordinates exist
                if (marker.coordinates) {
                  return (
                    <Marker
                      key={index}
                      coordinate={marker.coordinates}
                      title={marker.note}
                    >
                      <Callout>
                        <View style={styles.callout}>
                          <View style={styles.calloutImageContainer}>
                            <ExpoImage
                              source={[{ uri: marker.uri }]}
                              style={styles.calloutImage}
                            />
                          </View>
                          <Text>{marker.note}</Text>
                        </View>
                      </Callout>
                    </Marker>
                  );
                }
                // Return null if coordinates are not present
                return null;
              })}
          </MapView>

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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
  },
  text: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 18,
  },
  input: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  mapContainer: {
    width: "100%",
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
  },
  mapChoose: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  callout: {
    width: 200,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  calloutImageContainer: {
    width: 180,
    height: 200,
    marginBottom: 10,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
  },
  calloutImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
