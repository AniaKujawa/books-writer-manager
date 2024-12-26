import "react-native-get-random-values";
import { router } from "expo-router";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../styles";
import { Character, TimelineEvent, Project } from "../../../types";
import { StyledTextInput } from "../../../components/TextInput";

export default function NewProjectScreen() {
  const [title, setTitle] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventChapter, setEventChapter] = useState("");
  const [eventPosition, setEventPosition] = useState("");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  const addCharacter = () => {
    if (characterName.trim()) {
      const newCharacter: Character = {
        id: uuidv4(),
        name: characterName,
        description: characterDescription,
      };
      setCharacters([...characters, newCharacter]);
      setCharacterName("");
      setCharacterDescription("");
    }
  };

  const addTimelineEvent = () => {
    if (eventTitle.trim()) {
      const newEvent: TimelineEvent = {
        id: uuidv4(),
        title: eventTitle,
        description: eventDescription,
        chapter: parseInt(eventChapter) || 1,
        position: parseInt(eventPosition) || 0,
      };
      setTimeline([...timeline, newEvent]);
      setEventTitle("");
      setEventDescription("");
      setEventChapter("");
      setEventPosition("");
    }
  };

  const saveProject = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      const newProjectId = uuidv4();
      const newProject: Project = {
        id: newProjectId,
        title,
        characters,
        timeline,
        currentPosition: 0,
      };

      const savedProjects = await AsyncStorage.getItem("projects");
      const projects = savedProjects ? JSON.parse(savedProjects) : [];
      projects.push(newProject);

      await AsyncStorage.setItem("projects", JSON.stringify(projects));
      router.push(`/`);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Project</Text>

      <View style={styles.section}>
        <StyledTextInput
          label="Project Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Characters</Text>
        <View
          style={{
            borderRadius: 8,
          }}
        >
          {characters.map((char) => (
            <View
              key={char.id}
              style={{
                marginBottom: 12,
                backgroundColor: "white",
                padding: 12,
                borderRadius: 8,
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}
              >
                {char.name}
              </Text>
              {char.description && (
                <Text style={{ fontSize: 14, color: "#666" }}>
                  {char.description.slice(0, 100)}
                </Text>
              )}
            </View>
          ))}
        </View>
        <StyledTextInput
          label="Character Name"
          value={characterName}
          onChangeText={setCharacterName}
          mode="outlined"
          style={{ marginBottom: 8 }}
        />
        <StyledTextInput
          label="Character Description"
          value={characterDescription}
          onChangeText={setCharacterDescription}
          mode="outlined"
          multiline
          style={{ marginBottom: 8 }}
        />
        <Button
          mode="contained"
          onPress={addCharacter}
          style={{ marginBottom: 8 }}
        >
          Add Character
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Timeline Events</Text>
        <StyledTextInput
          label="Event Title"
          value={eventTitle}
          onChangeText={setEventTitle}
          mode="outlined"
          style={{ marginBottom: 8 }}
        />
        <StyledTextInput
          label="Event Description"
          value={eventDescription}
          onChangeText={setEventDescription}
          mode="outlined"
          multiline
          style={{ marginBottom: 8 }}
        />
        <StyledTextInput
          label="Chapter Number"
          value={eventChapter}
          onChangeText={setEventChapter}
          mode="outlined"
          keyboardType="numeric"
          style={{ marginBottom: 8 }}
        />
        <StyledTextInput
          label="Position (0-100)"
          value={eventPosition}
          onChangeText={setEventPosition}
          mode="outlined"
          keyboardType="numeric"
          style={{ marginBottom: 8 }}
        />
        <Button
          mode="contained"
          onPress={addTimelineEvent}
          style={{ marginBottom: 8 }}
        >
          Add Event
        </Button>
        {timeline.map((event) => (
          <Text key={event.id} style={{ marginBottom: 4 }}>
            • {event.title} (Chapter {event.chapter})
          </Text>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={saveProject}
        style={{ marginVertical: 16 }}
      >
        Save Project
      </Button>
    </ScrollView>
  );
}
