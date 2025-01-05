import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { styles } from "./../../styles";

const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("Storage successfully cleared!");
  } catch (e) {
    console.error("Error clearing storage:", e);
  }
};

// Separate FAB group component
function FABGroup() {
  const [open, setOpen] = useState(false);

  return (
    <Portal>
      <FAB.Group
        open={open}
        visible
        icon={open ? "close" : "menu"}
        actions={[
          {
            icon: "plus",
            label: "New Project",
            onPress: () => router.push("/project/new"),
          },
          {
            icon: "folder",
            label: "All Projects",
            onPress: () => router.push("/projects"),
          },
          {
            icon: "delete",
            label: "Clear Storage",
            onPress: clearStorage,
          },
        ]}
        onStateChange={({ open }) => setOpen(open)}
        style={styles.fab}
      />
    </Portal>
  );
}

export default FABGroup;
