import { DefaultTheme } from "react-native-paper";

export const theme = {
  colors: {
    primary: '#6B4EFF',
    background: '#FFFFFF',
    text: '#333333',
    error: '#FF0000',
  },
};

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
  },
};