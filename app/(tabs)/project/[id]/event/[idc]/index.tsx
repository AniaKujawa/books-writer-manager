import { useLocalSearchParams } from "expo-router";
import { ScrollView, View, Alert } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../../../../styles";
import { TimelineEvent, Project } from "../../../../../../types";
import { StyledTextInput } from "../../../../../../components/TextInput";
import { router } from "expo-router";

export default function EventScreen() {
  const { id, idc } = useLocalSearchParams();
  const [eventData, setEventData] = useState<TimelineEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const savedProjects = await AsyncStorage.getItem("projects");
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const project = projects.find((p: Project) => p.id === id);
          if (project) {
            const foundEvent = project.timeline.find(
              (e: TimelineEvent) => e.id === idc
            );
            if (foundEvent) {
              setEventData(foundEvent);
            }
          }
        }
      } catch (error) {
        console.error("Error loading event:", error);
      }
    };

    loadEvent();
  }, [id, idc]);

  const saveEvent = async () => {
    try {
      const savedProjects = await AsyncStorage.getItem("projects");
      if (savedProjects && eventData) {
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.map((project: Project) => ({
          ...project,
          timeline: project.timeline.map((event: TimelineEvent) =>
            event.id === eventData.id ? eventData : event
          ),
        }));
        await AsyncStorage.setItem("projects", JSON.stringify(updatedProjects));
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const deleteEvent = async () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const savedProjects = await AsyncStorage.getItem("projects");
              if (savedProjects) {
                const projects = JSON.parse(savedProjects);
                const updatedProjects = projects.map((project: Project) => ({
                  ...project,
                  timeline: project.timeline.filter(
                    (event: TimelineEvent) => event.id !== idc
                  ),
                }));
                await AsyncStorage.setItem(
                  "projects",
                  JSON.stringify(updatedProjects)
                );
                router.back();
              }
            } catch (error) {
              console.error("Error deleting event:", error);
            }
          },
        },
      ]
    );
  };

  if (!eventData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.section}>
          <Card.Content>
            {isEditing ? (
              <>
                <StyledTextInput
                  label="Title"
                  value={eventData.title}
                  onChangeText={(text: string) =>
                    setEventData({ ...eventData, title: text })
                  }
                  style={{ marginBottom: 16 }}
                />
                <StyledTextInput
                  label="Description"
                  value={eventData.description}
                  onChangeText={(text: string) =>
                    setEventData({ ...eventData, description: text })
                  }
                  multiline
                  numberOfLines={4}
                  style={{ marginBottom: 16 }}
                />
                <Button
                  mode="contained"
                  onPress={saveEvent}
                  style={{ marginBottom: 8 }}
                >
                  Save Changes
                </Button>
                <Button mode="outlined" onPress={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Text variant="titleLarge" style={{ marginBottom: 8 }}>
                  {eventData.title}
                </Text>
                <Text style={{ marginBottom: 16 }}>
                  {eventData.description}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => setIsEditing(true)}
                  style={{ marginBottom: 8 }}
                >
                  Edit Event
                </Button>
                <Button mode="outlined" onPress={deleteEvent}>
                  Delete Event
                </Button>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
