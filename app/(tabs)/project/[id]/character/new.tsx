import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";
import { Button, Card } from "react-native-paper";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../../../styles";
import { Character, Project } from "../../../../../types";
import { StyledTextInput } from "../../../../../components/TextInput";

export default function NewCharacterScreen() {
  const { id } = useLocalSearchParams();
  const [characterData, setCharacterData] = useState<Character>({
    id: uuidv4(),
    name: "",
    description: "",
  });

  const saveCharacter = async () => {
    try {
      const savedProjects = await AsyncStorage.getItem("projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.map((project: Project) => {
          if (project.id === id) {
            return {
              ...project,
              characters: [...project.characters, characterData],
            };
          }
          return project;
        });
        await AsyncStorage.setItem("projects", JSON.stringify(updatedProjects));
        router.push({
          pathname: "/project/[id]",
          params: { id },
        });
      }
    } catch (error) {
      console.error("Error saving character:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.section}>
        <Card.Title title="New Character" />
        <Card.Content>
          <StyledTextInput
            label="Name"
            value={characterData.name}
            style={{ marginBottom: 16 }}
            onChangeText={(text: string) =>
              setCharacterData({ ...characterData, name: text })
            }
          />
          <StyledTextInput
            label="Description"
            value={characterData.description}
            multiline
            numberOfLines={3}
            onChangeText={(text: string) =>
              setCharacterData({ ...characterData, description: text })
            }
          />
          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={saveCharacter}
            disabled={!characterData.name}
          >
            Create Character
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
