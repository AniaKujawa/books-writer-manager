import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function Layout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="project/new"
          options={{
            title: "New Project",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="project/[id]"
          options={{
            title: "Project Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="projects"
          options={{
            title: "All Projects",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            title: "Current Project",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="character/[id]"
          options={{
            title: "Character Details",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
