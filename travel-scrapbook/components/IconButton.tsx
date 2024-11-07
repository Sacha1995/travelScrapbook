import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type IconName = "edit" | "delete" | "close" | "check";

interface IconButtonProps {
  iconName: IconName;
  onPress: () => void;
  color?: string;
  size?: number;
  style?: object;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  onPress,
  color = "#ffd33d", // Default color
  size = 32, // Default size
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <MaterialIcons name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default IconButton;
