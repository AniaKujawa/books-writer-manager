import { useLocalSearchParams, router } from "expo-router";
import { View, Alert } from "react-native";
import { Text, FAB, Card, IconButton } from "react-native-paper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../../styles";
import { Project } from "../../../../types";
import { StyledTextInput } from "../../../../components/TextInput";
import { Timeline } from "../../../../components/Timeline";
import { DraggableEventCard } from "../../../../components/DraggableEvent";
import { NestableScrollContainer } from "react-native-draggable-flatlist";
import { useProjectActions } from "../../../../hooks";
import { Menu } from "../../../../components/Menu";

export default function ProjectScreen() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const { deleteProject } = useProjectActions();

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

  const saveProject = async (dataToSave = projectData) => {
    try {
      const savedProjects = await AsyncStorage.getItem("projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.map((p: Project) =>
          p.id === dataToSave?.id ? dataToSave : p
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
      <NestableScrollContainer>
        {/* Project Title Section */}
        <Card style={styles.section}>
          <Card.Title
            title="Project Details"
            right={(props) => (
              <View style={{ flexDirection: "row" }}>
                {isEditing && (
                  <IconButton
                    {...props}
                    icon="delete"
                    iconColor="red"
                    onPress={() => deleteProject(projectData.id)}
                  />
                )}
                <IconButton
                  {...props}
                  icon={isEditing ? "check" : "pencil"}
                  iconColor={isEditing ? "green" : undefined}
                  onPress={() => {
                    if (isEditing) {
                      saveProject();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                />
              </View>
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

        {/* Notes Section */}
        <Card style={styles.section}>
          <Card.Title title="Notes" />
          <Card.Content>
            {isEditing ? (
              <StyledTextInput
                value={projectData.notes || ""}
                onChangeText={(text: string) =>
                  setProjectData({ ...projectData, notes: text })
                }
                multiline
                numberOfLines={6}
                style={styles.notesInput}
              />
            ) : (
              <Text style={styles.notes}>{projectData.notes || "-"}</Text>
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
          <Card.Title title="Timeline" />
          <Card.Content>
            <Timeline
              events={projectData.timeline}
              EventCard={DraggableEventCard}
              onAddEvent={async (event) => {
                const newProjectData = {
                  ...projectData,
                  timeline: [...projectData.timeline, event],
                };
                setProjectData(newProjectData);
                await saveProject(newProjectData);
              }}
              onUpdateEvent={async (event) => {
                const newProjectData = {
                  ...projectData,
                  timeline: projectData.timeline.map((e) =>
                    e.id === event.id ? event : e
                  ),
                };
                setProjectData(newProjectData);
                await saveProject(newProjectData);
              }}
              onRemoveEvent={async (event) => {
                const confirmed = await new Promise((resolve) => {
                  Alert.alert(
                    "Remove Event",
                    "Are you sure you want to remove this event?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => resolve(false),
                      },
                      {
                        text: "Remove",
                        style: "destructive",
                        onPress: () => resolve(true),
                      },
                    ]
                  );
                });

                if (confirmed) {
                  const newProjectData = {
                    ...projectData,
                    timeline: projectData.timeline.filter(
                      (e) => e.id !== event.id
                    ),
                  };
                  setProjectData(newProjectData);
                  await saveProject(newProjectData);
                }
              }}
            />
          </Card.Content>
        </Card>
      </NestableScrollContainer>

      <FAB
        icon="content-save"
        style={styles.fab}
        onPress={() => saveProject(projectData)}
        visible={isEditing}
      />
      {!isEditing && <Menu />}
    </View>
  );
}
