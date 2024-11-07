import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RouteProp } from "@react-navigation/native";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffd33d",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scrapbook"
        options={{
          title: "Scrapbook",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "images" : "images-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
