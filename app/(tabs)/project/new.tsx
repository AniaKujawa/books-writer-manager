import { router } from "expo-router";
import { View, ScrollView } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../styles";
import { Project } from "../../../types";
import { StyledTextInput } from "../../../components/TextInput";

export default function NewProjectScreen() {
  const [projectData, setProjectData] = useState<Project>({
    id: uuidv4(),
    title: "",
    description: "",
    notes: "",
    characters: [],
    timeline: [],
    currentPosition: 0,
  });

  const saveProject = async () => {
    if (!projectData.title.trim()) {
      return;
    }

    try {
      const savedProjects = await AsyncStorage.getItem("projects");
      const projects = savedProjects ? JSON.parse(savedProjects) : [];
      projects.push(projectData);
      await AsyncStorage.setItem("projects", JSON.stringify(projects));
      router.push(`/project/${projectData.id}`);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Project Details Section */}
        <Card style={styles.section}>
          <Card.Title title="Project Details" />
          <Card.Content>
            <StyledTextInput
              label="Title"
              value={projectData.title}
              onChangeText={(text: string) =>
                setProjectData({ ...projectData, title: text })
              }
              style={{ marginBottom: 16 }}
            />
            <StyledTextInput
              label="Description"
              value={projectData.description}
              onChangeText={(text: string) =>
                setProjectData({ ...projectData, description: text })
              }
              multiline
              numberOfLines={3}
              style={{ marginBottom: 16 }}
            />
          </Card.Content>
        </Card>

        {/* Info Text */}
        <Text style={styles.infoText}>
          You can add additional info after creating the project.
        </Text>

        {/* Create Button */}
        <Button
          mode="contained"
          onPress={saveProject}
          disabled={!projectData.title.trim()}
        >
          Create Project
        </Button>
      </ScrollView>
    </View>
  );
}
