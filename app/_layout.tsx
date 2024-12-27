import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function Layout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="index"
          options={{
            title: "Current Project",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(tabs)/project/new"
          options={{
            title: "New Project",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(tabs)/project/[id]/index"
          options={{
            title: "Project Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(tabs)/projects"
          options={{
            title: "All Projects",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(tabs)/project/[id]/character/new"
          options={{
            title: "New Character",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="(tabs)/project/[id]/character/[idc]/index"
          options={{
            title: "Character Details",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
