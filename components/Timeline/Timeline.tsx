import { View, Pressable } from "react-native";
import { Button, Portal, Modal, TextInput, Text } from "react-native-paper";
import { useState } from "react";
import { generateId } from "@/utils/generateId";
import { TimelineEvent } from "../../types";
import { styles } from "./Timeline.styles";
import NestedDraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

interface TimelineProps {
  events: TimelineEvent[];
  onAddEvent: (event: TimelineEvent) => Promise<void>;
  onUpdateEvent: (event: TimelineEvent) => Promise<void>;
  onRemoveEvent: (event: TimelineEvent) => Promise<void>;
  EventCard: React.ComponentType<any>;
  isEditable?: boolean;
  projectId: string;
  finishedChapters: number[];
  onChapterToggle: (chapter: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onRemoveEvent,
  EventCard,
  isEditable = true,
  projectId,
  finishedChapters = [],
  onChapterToggle,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventChapter, setNewEventChapter] = useState("");

  // Group events by chapter and sort by order
  const groupedEvents = events.reduce((acc, event) => {
    const chapter = event.chapter;
    if (!acc[chapter]) {
      acc[chapter] = [];
    }
    acc[chapter].push(event);
    // Sort events within chapter by order
    acc[chapter].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  const chapters = Object.keys(groupedEvents)
    .map(Number)
    .sort((a, b) => a - b);

  const renderChapterEvents = (chapter: number) => {
    return (
      <NestedDraggableFlatList
        data={groupedEvents[chapter] || []}
        keyExtractor={(item) => item.id}
        renderItem={({
          item,
          drag,
          isActive,
        }: RenderItemParams<TimelineEvent>) => (
          <ScaleDecorator>
            <EventCard
              event={item}
              onLongPress={drag}
              isActive={isActive}
              isEditable={isEditable}
              projectId={projectId}
              onMove={(newChapter: number) => {
                if (newChapter !== chapter) {
                  // Calculate new order for moved item
                  const targetChapterEvents = groupedEvents[newChapter] || [];
                  const newOrder = targetChapterEvents.length;
                  onUpdateEvent({
                    ...item,
                    chapter: newChapter,
                    order: newOrder,
                  });
                }
              }}
              onRemove={() => onRemoveEvent(item)}
            />
          </ScaleDecorator>
        )}
        onDragEnd={({ data }) => {
          // Update order within same chapter
          data.forEach((event, index) => {
            if (event.order !== index) {
              onUpdateEvent({ ...event, order: index });
            }
          });
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeline}>
        {chapters.map((chapter) => (
          <View key={chapter} style={styles.timelineSection}>
            <View style={styles.chapterIndicator}>
              <Pressable
                onPress={() => onChapterToggle?.(chapter)}
                style={() => [
                  styles.circle,
                  finishedChapters.includes(chapter) && styles.filledCircle,
                ]}
              >
                <Text
                  style={[
                    styles.chapterText,
                    finishedChapters.includes(chapter) &&
                      styles.filledChapterText,
                  ]}
                >
                  {chapter}
                </Text>
              </Pressable>
              <View style={styles.line} />
            </View>
            <View style={styles.eventsContainer}>
              {renderChapterEvents(chapter)}
            </View>
          </View>
        ))}
      </View>

      {isEditable && (
        <Button
          mode="contained"
          onPress={() => setIsModalVisible(true)}
          style={styles.addButton}
        >
          Add Event
        </Button>
      )}

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
            onPress={() => {
              onAddEvent({
                id: generateId(),
                title: newEventTitle,
                description: newEventDescription,
                chapter: parseInt(newEventChapter) || 1,
                order: 0,
              });
              setIsModalVisible(false);
              setNewEventTitle("");
              setNewEventDescription("");
              setNewEventChapter("");
            }}
            style={{ backgroundColor: "#6B4EFF" }}
          >
            Add Event
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};
