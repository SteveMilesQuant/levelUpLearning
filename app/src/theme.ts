import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  components: {
    Heading: { baseStyle: { textColor: "brand.primary" } },
    Text: { baseStyle: { textColor: "brand.text" } },
    FormLabel: {
      baseStyle: { textColor: "brand.primary", fontWeight: "bold" },
    },
    Link: { baseStyle: { textColor: "brand.primary" } },
  },
  styles: {
    global: {
      body: { fontFamily: "Georgia", textColor: "brand.primary" },
      input: { textColor: "brand.text" },
      select: { textColor: "brand.text" },
      textarea: { textColor: "brand.text" },
      strong: { textColor: "brand.primary" },
      tbody: { textColor: "brand.text" },
    },
  },
  colors: {
    brand: {
      primary: "rgb(4,0,154)",
      secondary: "#ace7f9",
      gradient3: "rgb(192,254,252)",
      gradient2: "rgb(119,172,241)",
      text: "rgb(38, 72, 201)",
      pageHeader: "rgb(4,0,154)",
      buttonBg: "#ace7f9",
      thText: "rgb(4,0,154)",
      hover: "rgb(237, 242, 247)",
      selected: "rgb(203, 213, 224)",
      disabled: "rgb(237, 242, 247)"
    },
  },
});

export default theme;
