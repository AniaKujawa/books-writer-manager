import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ProjectScreen() {
  const { id, project } = useLocalSearchParams();
  const projectData = JSON.parse(project as string);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24 }}>{projectData.title}</Text>
      {/* Add your project details UI here */}
    </View>
  );
}
