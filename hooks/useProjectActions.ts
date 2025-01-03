import { Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project } from "../types";

export const useProjectActions = () => {
  const deleteProject = async (projectId: string | number, onSuccess?: () => void) => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const savedProjects = await AsyncStorage.getItem("projects");
              if (savedProjects) {
                const projects = JSON.parse(savedProjects);
                const updatedProjects = projects.filter(
                  (p: Project) => p.id !== projectId
                );
                await AsyncStorage.setItem(
                  "projects",
                  JSON.stringify(updatedProjects)
                );
                
                if (onSuccess) {
                  onSuccess();
                } else {
                  router.replace("/(tabs)/projects");
                }
              }
            } catch (error) {
              console.error("Error deleting project:", error);
            }
          }
        }
      ]
    );
  };

  return { deleteProject };
};
