import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  axis: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#ccc',
  },
  eventCard: {
    width: 120,
    marginTop: -60, // Position above the axis
  },
  chapterMarker: {
    position: 'absolute',
    bottom: 10,
    height: 20,
    width: 2,
    backgroundColor: '#666',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginVertical: 8,
  },  
  container: {
    flex: 1,
  },
  timeline: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  timelineSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  chapterIndicator: {
    width: 40,
    alignItems: "center",
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6B4EFF",
    justifyContent: "center",
    alignItems: "center",
  },
  chapterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#6B4EFF",
    marginTop: 4,
  },
  eventsContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  addButton: {
    margin: 16,
    backgroundColor: "#6B4EFF",
  },
});