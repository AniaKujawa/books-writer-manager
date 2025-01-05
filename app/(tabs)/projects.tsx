import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton } from "react-native-paper";
import { Menu } from "@/components/Menu";

import { styles } from "../../styles";
import { Project } from "../../types";
import { useProjectActions } from "../../hooks";

export default function ProjectsScreen() {
  const { deleteProject } = useProjectActions();
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
    <View style={styles.projectContainer}>
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
      <IconButton
        icon="delete"
        iconColor="red"
        size={20}
        onPress={() =>
          deleteProject(item.id, () => {
            // Refresh projects list after deletion
            setProjects((prev) => prev.filter((p) => p.id !== item.id));
          })
        }
      />
    </View>
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
      <Menu />
    </View>
  );
}
