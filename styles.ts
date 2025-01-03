import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  characterList: {
    flexGrow: 0,
  },
  characterCard: {
    padding: 12,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    minWidth: 100,
  },
  characterName: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6200ee',
  },
  characterButton: {
    marginBottom: 8,
  },
  timeline: {
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  timelineBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 30,
  },
  progressIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#6200ee',
    borderRadius: 10,
    top: -8,
    marginLeft: -10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    color: "#666",
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  projectCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  customField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 2,
  },
  customFieldLabel: {
    fontWeight: '600',
    minWidth: 100,
    marginRight: 4,
  },
  customFieldValue: {
    flex: 1,
  },
  addFieldButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  addFieldButton: {
    marginLeft: 8,
  },
  addButton: {
    marginTop: 16,
  },
  projectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});