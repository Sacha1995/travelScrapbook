import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Coordinates {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

interface ImageType {
  uri: string;
  note: string;
  date: string | Date;
  coordinates?: Coordinates;
}

interface Trip {
  images: ImageType[];
  coordinates?: Coordinates;
}

interface TripsState {
  trips: Record<string, Trip>;
  selectedTrip: string;

  setTrips: (newTrips: Record<string, Trip>) => void;
  addTrip: (tripName: string) => void;
  updateSelectedTrip: (tripName: string) => void;
  setImagesForTrip: (tripName: string, images: ImageType[]) => void;
  setCoordinatesForTrip: (tripName: string, coordinates: Coordinates) => void;
}

const useTripsStore = create<TripsState>((set) => ({
  trips: {},
  selectedTrip: "",

  setTrips: (newTrips) => {
    AsyncStorage.setItem("trips", JSON.stringify(newTrips)).catch(
      console.error
    );
    set(() => ({
      trips: newTrips,
    }));
  },

  addTrip: (tripName) => {
    set((state) => {
      const updatedTrips = {
        ...state.trips,
        [tripName]: { images: [], coordinates: undefined },
      };
      AsyncStorage.setItem("trips", JSON.stringify(updatedTrips)).catch(
        console.error
      );
      return { trips: updatedTrips };
    });
  },

  updateSelectedTrip: (tripName) =>
    set(() => ({
      selectedTrip: tripName,
    })),

  setImagesForTrip: (tripName, images) => {
    set((state) => {
      const updatedTrips = {
        ...state.trips,
        [tripName]: {
          ...state.trips[tripName],
          images: images,
        },
      };
      AsyncStorage.setItem("trips", JSON.stringify(updatedTrips)).catch(
        console.error
      );
      return { trips: updatedTrips };
    });
  },

  setCoordinatesForTrip: (tripName, coordinates) => {
    set((state) => {
      const updatedTrips = {
        ...state.trips,
        [tripName]: {
          ...state.trips[tripName],
          coordinates,
        },
      };
      AsyncStorage.setItem("trips", JSON.stringify(updatedTrips)).catch(
        console.error
      );
      return { trips: updatedTrips };
    });
  },
}));

const loadTrips = async () => {
  try {
    const tripsData = await AsyncStorage.getItem("trips");
    if (tripsData) {
      const trips = JSON.parse(tripsData);
      useTripsStore.getState().setTrips(trips);
    }
  } catch (error) {
    console.error("Failed to load trips from AsyncStorage:", error);
  }
};

loadTrips();

export default useTripsStore;
