// src/components/Box.ts
import { createBox } from "@shopify/restyle";
import { Theme } from "@/theme/theme";

const Box = createBox<Theme>(); // Creates a Box component with theme support
export default Box;
