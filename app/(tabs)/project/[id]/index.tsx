import { useLocalSearchParams, router } from "expo-router";
import { View, ScrollView } from "react-native";
import { Text, FAB, Card, IconButton } from "react-native-paper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../../styles";
import { Project } from "../../../../types";
import { StyledTextInput } from "../../../../components/TextInput";
import { Timeline } from "../../../../components/Timeline";
import { DraggableEventCard } from "../../../../components/DraggableEvent";

export default function ProjectScreen() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [projectData, setProjectData] = useState<Project | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const savedProjects = await AsyncStorage.getItem("projects");
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const foundProject = projects.find((p: Project) => p.id === id);
          if (foundProject) {
            setProjectData(foundProject);
          }
        }
      } catch (error) {
        console.error("Error loading project:", error);
      }
    };

    loadProject();
  }, [id]);

  if (!projectData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const saveProject = async () => {
    try {
      const savedProjects = await AsyncStorage.getItem("projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.map((p: Project) =>
          p.id === projectData?.id ? projectData : p
        );
        await AsyncStorage.setItem("projects", JSON.stringify(updatedProjects));
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Project Title Section */}
        <Card style={styles.section}>
          <Card.Title
            title="Project Details"
            right={(props) => (
              <IconButton
                {...props}
                icon={isEditing ? "check" : "pencil"}
                onPress={() => {
                  if (isEditing) {
                    saveProject();
                  } else {
                    setIsEditing(true);
                  }
                }}
              />
            )}
          />
          <Card.Content>
            {isEditing ? (
              <StyledTextInput
                value={projectData.title}
                style={{ marginBottom: 16 }}
                onChangeText={(text: string) =>
                  setProjectData({ ...projectData, title: text })
                }
              />
            ) : (
              <Text style={styles.title}>{projectData.title}</Text>
            )}
            {isEditing ? (
              <StyledTextInput
                value={projectData.description}
                label="Description"
                multiline
                numberOfLines={3}
                onChangeText={(text: string) =>
                  setProjectData({ ...projectData, description: text })
                }
              />
            ) : (
              <Text style={styles.description}>{projectData.description}</Text>
            )}
          </Card.Content>
        </Card>

        {/* Characters Section */}
        <Card style={styles.section}>
          <Card.Title
            title="Characters"
            right={(props) => (
              <IconButton
                {...props}
                icon="plus"
                onPress={() => {
                  router.push({
                    pathname: "(tabs)/project/[id]/character/new",
                    params: { id: projectData.id },
                  });
                }}
              />
            )}
          />
          <Card.Content style={{ gap: 16 }}>
            {projectData.characters.map((character) => (
              <Card
                key={character.id}
                onPress={() =>
                  router.push({
                    pathname: "/project/[id]/character/[idc]",
                    params: {
                      id: projectData.id,
                      idc: character.id,
                    },
                  })
                }
              >
                <Card.Content style={{ padding: 4 }}>
                  <Text style={styles.characterName}>{character.name}</Text>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>

        {/* Timeline Section */}
        <Card style={styles.section}>
          <Card.Content>
            <Timeline
              events={projectData.timeline}
              EventCard={DraggableEventCard}
              onAddEvent={() => {}}
              onUpdateEvent={() => {}}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="content-save"
        style={styles.fab}
        onPress={saveProject}
        visible={isEditing}
      />
    </View>
  );
}
