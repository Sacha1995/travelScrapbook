import { create } from "zustand";
import { Region } from "react-native-maps";

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

  setTrips: (newTrips) =>
    set(() => ({
      trips: newTrips,
    })),

  addTrip: (tripName) =>
    set((state) => ({
      trips: {
        ...state.trips,
        [tripName]: { images: [], coordinates: undefined },
      },
    })),

  updateSelectedTrip: (tripName) =>
    set(() => ({
      selectedTrip: tripName,
    })),

  setImagesForTrip: (tripName, images) =>
    set((state) => ({
      trips: {
        ...state.trips,
        [tripName]: {
          ...state.trips[tripName],
          images: images,
        },
      },
    })),

  setCoordinatesForTrip: (tripName, coordinates) =>
    set((state) => ({
      trips: {
        ...state.trips,
        [tripName]: {
          ...state.trips[tripName],
          coordinates,
        },
      },
    })),
}));

export default useTripsStore;
