import { create } from "zustand";

interface ImageType {
  uri: string;
  note: string;
  date: string | Date;
}

interface TripsState {
  trips: Record<string, ImageType[]>;
  selectedTrip: string;

  setTrips: (newTrips: Record<string, ImageType[]>) => void;
  addTrip: (tripName: string) => void;
  updateSelectedTrip: (tripName: string) => void;
  setImagesForTrip: (tripName: string, images: ImageType[]) => void;
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
        [tripName]: [],
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
        [tripName]: images,
      },
    })),
}));

export default useTripsStore;
