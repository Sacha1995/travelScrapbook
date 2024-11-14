import { createTheme } from "@shopify/restyle";

const theme = createTheme({
  colors: {
    black: "25292e",
    yellow: "ffd33d",
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
});

export type Theme = typeof theme;
export default theme;
