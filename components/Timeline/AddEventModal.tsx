import { Button, TextInput } from "react-native-paper";

import { useCallback, useState } from "react";
import { Portal } from "react-native-paper";

import { Modal } from "react-native-paper";
import { generateId } from "@/utils/generateId";
import { TimelineEvent } from "@/types";
import { styles } from "./Timeline.styles";

interface IProps {
  onAddEvent: (event: TimelineEvent) => Promise<void>;
}

export const AddEventModal = ({ onAddEvent }: IProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventChapter, setNewEventChapter] = useState("");

  const handleAddEvent = useCallback(async () => {
    const newEvent = {
      id: generateId(),
      title: newEventTitle,
      description: newEventDescription,
      chapter: parseInt(newEventChapter) || 1,
      order: 0,
    };

    setIsModalVisible(false);
    setNewEventTitle("");
    setNewEventDescription("");
    setNewEventChapter("");

    await onAddEvent(newEvent);
  }, [newEventTitle, newEventDescription, newEventChapter, onAddEvent]);

  return (
    <>
      <Button
        mode="contained"
        onPress={() => setIsModalVisible(true)}
        style={styles.addButton}
      >
        Add Event
      </Button>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 12,
          }}
        >
          <TextInput
            label="Title"
            value={newEventTitle}
            onChangeText={setNewEventTitle}
            style={{ marginBottom: 12 }}
          />
          <TextInput
            label="Description"
            value={newEventDescription}
            onChangeText={setNewEventDescription}
            multiline
            numberOfLines={3}
            style={{ marginBottom: 12 }}
          />
          <TextInput
            label="Chapter"
            value={newEventChapter}
            onChangeText={setNewEventChapter}
            keyboardType="numeric"
            style={{ marginBottom: 12 }}
          />
          <Button
            mode="contained"
            onPress={handleAddEvent}
            style={{ backgroundColor: "#6B4EFF" }}
          >
            Add Event
          </Button>
        </Modal>
      </Portal>
    </>
  );
};
