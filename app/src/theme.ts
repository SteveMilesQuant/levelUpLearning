import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: { global: { body: { fontFamily: "Georgia" } } },
  colors: {
    brand: {
      primary: "rgb(4,0,154)",
      secondary: "rgb(62, 219, 240)",
    },
  },
});

export default theme;
