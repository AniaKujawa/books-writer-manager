import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { View, ScrollView, Alert } from "react-native";
import { Text, FAB, Card, IconButton, Button } from "react-native-paper";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../../../../../styles";
import { Character, Project, CustomField } from "../../../../../../types";
import { StyledTextInput } from "../../../../../../components/TextInput";
import { v4 as uuidv4 } from "uuid";

export default function CharacterScreen() {
  const { id, idc } = useLocalSearchParams();
  const [characterData, setCharacterData] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [isAddingField, setIsAddingField] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCharacter();
    }, [id, idc])
  );

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

  const addCustomField = () => {
    if (!characterData) return;

    const newField: CustomField = {
      id: uuidv4(),
      label: newFieldLabel,
      value: newFieldValue,
    };

    setCharacterData({
      ...characterData,
      customFields: [...(characterData.customFields || []), newField],
    });

    setNewFieldLabel("");
    setNewFieldValue("");
    setIsAddingField(false);
  };

  const removeCustomField = (fieldId: string) => {
    if (!characterData) return;

    Alert.alert("Remove Field", "Are you sure you want to remove this field?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setCharacterData({
            ...characterData,
            customFields: characterData.customFields.filter(
              (field) => field.id !== fieldId
            ),
          });
        },
      },
    ]);
  };

  const deleteCharacter = async () => {
    Alert.alert(
      "Delete Character",
      "Are you sure you want to delete this character? This action cannot be undone.",
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
              if (savedProjects && characterData) {
                const projects = JSON.parse(savedProjects);
                const updatedProjects = projects.map((project: Project) => ({
                  ...project,
                  characters: project.characters.filter(
                    (char: Character) => char.id !== characterData.id
                  ),
                }));
                await AsyncStorage.setItem(
                  "projects",
                  JSON.stringify(updatedProjects)
                );
                router.back();
              }
            } catch (error) {
              console.error("Error deleting character:", error);
            }
          },
        },
      ]
    );
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
              <View style={{ flexDirection: "row" }}>
                {isEditing && (
                  <IconButton
                    {...props}
                    icon="delete"
                    iconColor="red"
                    onPress={deleteCharacter}
                  />
                )}
                <IconButton
                  {...props}
                  icon={isEditing ? "check" : "pencil"}
                  iconColor={isEditing ? "green" : undefined}
                  onPress={() => {
                    if (isEditing) {
                      saveCharacter();
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

            <Text style={{ marginTop: 32, marginBottom: 8 }}>
              Additional Info
            </Text>

            {characterData.customFields?.length > 0
              ? characterData.customFields.map((field) => (
                  <View key={field.id} style={styles.customField}>
                    {isEditing ? (
                      <>
                        <StyledTextInput
                          value={field.label}
                          onChangeText={(text: string) => {
                            setCharacterData({
                              ...characterData,
                              customFields: characterData.customFields.map(
                                (f) =>
                                  f.id === field.id ? { ...f, label: text } : f
                              ),
                            });
                          }}
                          style={[styles.customFieldLabel, { marginBottom: 0 }]}
                        />
                        <StyledTextInput
                          value={field.value}
                          onChangeText={(text: string) => {
                            setCharacterData({
                              ...characterData,
                              customFields: characterData.customFields.map(
                                (f) =>
                                  f.id === field.id ? { ...f, value: text } : f
                              ),
                            });
                          }}
                          style={{ marginBottom: 0 }}
                        />
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => removeCustomField(field.id)}
                        />
                      </>
                    ) : (
                      <>
                        <Text style={styles.customFieldLabel}>
                          {field.label}:
                        </Text>
                        <Text style={styles.customFieldValue}>
                          {field.value}
                        </Text>
                      </>
                    )}
                  </View>
                ))
              : !isEditing && <Text>-</Text>}

            {isEditing && (
              <>
                {isAddingField ? (
                  <View>
                    <StyledTextInput
                      label="Field Label"
                      value={newFieldLabel}
                      onChangeText={setNewFieldLabel}
                    />
                    <StyledTextInput
                      label="Field Value"
                      value={newFieldValue}
                      onChangeText={setNewFieldValue}
                    />
                    <View style={styles.addFieldButtons}>
                      <Button
                        mode="outlined"
                        onPress={() => setIsAddingField(false)}
                        style={styles.addFieldButton}
                      >
                        Cancel
                      </Button>
                      <Button
                        mode="contained"
                        onPress={addCustomField}
                        style={styles.addFieldButton}
                        disabled={!newFieldLabel || !newFieldValue}
                      >
                        Add
                      </Button>
                    </View>
                  </View>
                ) : (
                  <Button
                    mode="outlined"
                    onPress={() => setIsAddingField(true)}
                    style={styles.addButton}
                  >
                    Add additional info fields
                  </Button>
                )}
              </>
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
