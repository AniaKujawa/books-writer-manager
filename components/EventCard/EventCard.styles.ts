import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    margin: 4,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
});