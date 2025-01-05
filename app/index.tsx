import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, IconButton, Provider } from "react-native-paper";
import { Menu } from "@/components/Menu";

import { styles } from "../styles";
import { Project } from "../types";

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
          <View style={styles.timeline}>
            {/* Add timeline visualization here */}
            <View style={styles.timelineBar}>
              <View
                style={[
                  styles.progressIndicator,
                  { left: `${currentProject.currentPosition}%` },
                ]}
              />
            </View>
          </View>
        </View>
        <Menu />
      </View>
    </Provider>
  );
}
