import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 4,
  },
  cardContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
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
  activeCard: {
    backgroundColor: '#f0f0f0',
    transform: [{ scale: 1.05 }],
  }
});