import { createBox } from "@shopify/restyle";
import { Image } from "react-native"; // Import Image from react-native
import { Theme } from "@/theme/theme"; // Import your theme type

const ThemedImage = createBox<Theme, React.ComponentProps<typeof Image>>(Image);

export default ThemedImage;
