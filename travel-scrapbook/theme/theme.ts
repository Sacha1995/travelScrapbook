import { createTheme } from "@shopify/restyle";

const Theme = createTheme({
  colors: {
    black: "25292e",
    yellow: "ffd33d",
    text: "#fff",
    red: "#ff0000",
    muted: "#aaa",
    modalBackground: "rgba(0, 0, 0, 0.9)",
  },
  spacing: {
    s: 5,
    m: 14,
    l: 20,
    xl: 32,
  },
  borderRadius: {
    s: 5,
    m: 14,
    l: 18,
    xl: 32,
  },
  textVariants: {
    body: {
      fontSize: 16,
      color: "text",
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      color: "primary",
    },
    defaults: {
      fontSize: 14,
      color: "text",
    },
  },
  alignSelf: ["auto", "flex-start", "flex-end", "center", "stretch"],
});

export type Theme = typeof Theme;
export default Theme;
