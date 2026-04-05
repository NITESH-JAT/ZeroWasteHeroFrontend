import { Theme } from "@react-navigation/native";

export const colors = {
  primary: "#00A651",
  accent: "#FF7F00",
  background: "#F3F4F6",
  surface: "#FFFFFF",
  text: "#15202B",
  subtitle: "#5A6A7A",
  border: "#E5E7EB",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  md: 12,
  lg: 16,
  pill: 999,
};

const navigation: Theme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "System",
      fontWeight: "700",
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "800",
    },
  },
};

export const appTheme = {
  colors,
  spacing,
  radius,
  navigation,
};
