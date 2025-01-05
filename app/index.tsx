import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, IconButton, Provider } from "react-native-paper";
import { Menu } from "@/components/Menu";

import { styles } from "../styles";
import { Project } from "../types";
import { Timeline } from "@/components/Timeline";
import { DraggableEventCard } from "@/components/DraggableEvent";
import { NestableScrollContainer } from "react-native-draggable-flatlist";
import { EventCard } from "@/components/EventCard";

export default function HomeScreen() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    loadCurrentProject();
  }, []);

  const loadCurrentProject = async () => {
    try {
      const savedProjects = await AsyncStorage.getItem("projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        // Get the last project or null if no projects exist
        setCurrentProject(projects[projects.length - 1] || null);
      }
    } catch (error) {
      console.error("Error loading current project:", error);
    }
  };

  if (!currentProject) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          No current project. Create your first one!
        </Text>
        <Button
          mode="contained"
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => router.push("/project/new")}
        >
          Create New Project
        </Button>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>{currentProject.title}</Text>
          <IconButton
            icon="pencil"
            size={28}
            onPress={() =>
              router.push({
                pathname: "/project/[id]",
                params: { id: currentProject.id },
              })
            }
          />
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          {currentProject.notes ? (
            <Text style={styles.notes}>{currentProject.notes}</Text>
          ) : (
            <Text style={styles.emptyText}>No notes yet</Text>
          )}
        </View>

        {/* Characters Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Characters</Text>
          <ScrollView horizontal style={styles.characterList}>
            {currentProject.characters?.map((character) => (
              <Link
                key={character.id}
                href={{
                  pathname: "/character/[id]",
                  params: {
                    id: character.id,
                    character: JSON.stringify(character),
                  },
                }}
                asChild
              >
                <TouchableOpacity style={styles.characterCard}>
                  <Text style={styles.characterName}>{character.name}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <Card style={styles.section}>
            <Card.Content>
              {currentProject.timeline.length > 0 ? (
                <NestableScrollContainer>
                  <Timeline
                    events={currentProject.timeline}
                    onAddEvent={async () => {}}
                    onUpdateEvent={async () => {}}
                    onRemoveEvent={async () => {}}
                    EventCard={EventCard}
                    isEditable={false}
                  />
                </NestableScrollContainer>
              ) : (
                <Text style={styles.emptyText}>You have no events yet</Text>
              )}
            </Card.Content>
          </Card>
        </View>
        <Menu />
      </View>
    </Provider>
  );
}
