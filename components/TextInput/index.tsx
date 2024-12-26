import { TextInput } from "react-native-paper";

export const StyledTextInput = ({ ...props }) => (
  <TextInput
    mode="outlined"
    outlineStyle={{
      borderRadius: 16,
      borderColor: "#e0e0e0",
    }}
    {...props}
  />
);
