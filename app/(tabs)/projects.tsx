import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../styles";
import { Project } from "../../types";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const savedProjects = await AsyncStorage.getItem("projects");
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const renderProject = ({ item }: { item: Project }) => (
    <Link
      href={{
        pathname: "/project/[id]",
        params: { id: item.id, project: JSON.stringify(item) },
      }}
      asChild
    >
      <TouchableOpacity style={styles.projectCard}>
        <Text style={styles.projectTitle}>{item.title}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProject}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No projects yet. Create your first one!
          </Text>
        }
      />
    </View>
  );
}
