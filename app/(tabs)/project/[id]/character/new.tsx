import { useLocalSearchParams, router } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../../../styles";
import { Character, Project } from "../../../../../types";
import { StyledTextInput } from "../../../../../components/TextInput";
import { generateId } from "@/utils/generateId";

export default function NewCharacterScreen() {
  const { id } = useLocalSearchParams();
  const [characterData, setCharacterData] = useState<Character>({
    id: generateId(),
    name: "",
    description: "",
    customFields: [],
  });

  const addCustomField = () => {
    setCharacterData({
      ...characterData,
      customFields: [
        ...characterData.customFields,
        {
          id: generateId(),
          label: "",
          value: "",
        },
      ],
    });
  };

  const removeCustomField = (fieldId: string) => {
    setCharacterData({
      ...characterData,
      customFields: characterData.customFields.filter(
        (field) => field.id !== fieldId
      ),
    });
  };

  const updateCustomField = (
    fieldId: string,
    key: "label" | "value",
    text: string
  ) => {
    setCharacterData({
      ...characterData,
      customFields: characterData.customFields.map((field) =>
        field.id === fieldId ? { ...field, [key]: text } : field
      ),
    });
  };

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
      <ScrollView>
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
              style={{ marginBottom: 16 }}
              onChangeText={(text: string) =>
                setCharacterData({ ...characterData, description: text })
              }
            />

            {/* Custom Fields Section */}
            <Card.Title
              title="Additional Info"
              right={(props) => (
                <IconButton {...props} icon="plus" onPress={addCustomField} />
              )}
            />

            {characterData.customFields.map((field) => (
              <View key={field.id} style={styles.customField}>
                <StyledTextInput
                  value={field.label}
                  onChangeText={(text: string) =>
                    updateCustomField(field.id, "label", text)
                  }
                  placeholder="Label"
                  style={[styles.customFieldLabel, { marginBottom: 0 }]}
                />
                <StyledTextInput
                  value={field.value}
                  onChangeText={(text: string) =>
                    updateCustomField(field.id, "value", text)
                  }
                  placeholder="Value"
                  style={{ marginBottom: 0, flex: 1 }}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => removeCustomField(field.id)}
                />
              </View>
            ))}

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
      </ScrollView>
    </View>
  );
}
