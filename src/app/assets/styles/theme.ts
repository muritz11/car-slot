import {
  extendTheme,
  // theme as base
} from "@chakra-ui/react";
// @ts-ignore
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";
// 2. Extend the theme to include custom colors, fonts, etc

const styles = {
  global: (props: any) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: "#fff",
    },
  }),
};

const components = {
  Drawer: {
    // setup light/dark mode component defaults
    baseStyle: (props: Dict<any> | StyleFunctionProps) => ({
      dialog: {
        bg: mode("white", "#141214")(props),
      },
    }),
  },

  Button: {
    baseStyle: {
      _disabled: {
        bg: "#aaa",
        opacity: 1,
        color: "#fff",
        _hover: {
          bg: "#aaa",
          color: "#fff",
        },
      },
    },
  },
};

// 2. Add your color mode config
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles,
  components,
  colors: {
    brand: {
      primary: "#4b0082",
      greyText: "#4D4D4D",
      primaryTint: "#F2F4FE",
      primaryTintX: "#DBCCE6",
      text: "#0c0c0f",
      dimDark: "#222432",
      btnBlack: "#0C0C11",
      background: "#fff",
      tint: "#EDF3FC",
      heroColor: "#FAFBFF",
      heroColorBlack: "#000",

      tabIconDefault: "#ccc",
      tintTextColor: "#3E3E3E",
      tintBorder: "#cbd2d9",
      errorRed: "#FF3C3C",
      success: "#27A17C",
      successTint: "#e4fff1",
      orange: "#F9A43F",
      textMuted: "#808080",
    },
  },
  fonts: {
    heading: "var(--font-geist-mono), sans-serif",
    body: "var(--font-geist-sans)",
  },
});

export default theme;
