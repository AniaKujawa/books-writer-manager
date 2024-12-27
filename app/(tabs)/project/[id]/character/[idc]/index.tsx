import { useLocalSearchParams } from "expo-router";
import { View, ScrollView } from "react-native";
import { Text, FAB, Card, IconButton } from "react-native-paper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../../../../styles";
import { Character, Project } from "../../../../../../types";
import { StyledTextInput } from "../../../../../../components/TextInput";

export default function CharacterScreen() {
  const { id, idc } = useLocalSearchParams();
  const [characterData, setCharacterData] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const savedProjects = await AsyncStorage.getItem("projects");
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const project = projects.find((p: Project) => p.id === id);
          if (project) {
            const foundCharacter = project.characters.find(
              (c: Character) => c.id === idc
            );
            if (foundCharacter) {
              setCharacterData(foundCharacter);
            }
          }
        }
      } catch (error) {
        console.error("Error loading character:", error);
      }
    };

    loadCharacter();
  }, [id, idc]);

  const saveCharacter = async () => {
    try {
      const savedProjects = await AsyncStorage.getItem("projects");
      if (savedProjects && characterData) {
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.map((project: Project) => ({
          ...project,
          characters: project.characters.map((char: Character) =>
            char.id === characterData.id ? characterData : char
          ),
        }));
        await AsyncStorage.setItem("projects", JSON.stringify(updatedProjects));
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving character:", error);
    }
  };

  if (!characterData) {
    return (
      <View style={styles.container}>
        <Text>Loading character...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.section}>
          <Card.Title
            title="Character Details"
            right={(props) => (
              <IconButton
                {...props}
                icon={isEditing ? "check" : "pencil"}
                onPress={() => {
                  if (isEditing) {
                    saveCharacter();
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
                value={characterData.name}
                style={{ marginBottom: 16 }}
                onChangeText={(text: string) =>
                  setCharacterData({ ...characterData, name: text })
                }
              />
            ) : (
              <Text style={styles.title}>{characterData.name}</Text>
            )}
            {isEditing ? (
              <StyledTextInput
                value={characterData.description}
                label="Description"
                multiline
                numberOfLines={3}
                onChangeText={(text: string) =>
                  setCharacterData({ ...characterData, description: text })
                }
              />
            ) : (
              <Text style={styles.description}>
                {characterData.description}
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="content-save"
        style={styles.fab}
        onPress={saveCharacter}
        visible={isEditing}
      />
    </View>
  );
}
