import { View, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { TimelineEvent } from "../../types";
import { styles } from "./Timeline.styles";
import NestedDraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { AddEventModal } from "./AddEventModal";
import { useMemo, useCallback } from "react";

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
  // Memoize grouped events and chapters
  const { groupedEvents, chapters } = useMemo(() => {
    const groupedEvents = new Map<number, TimelineEvent[]>();

    events.forEach((event) => {
      const chapter = event.chapter;
      if (!groupedEvents.has(chapter)) {
        groupedEvents.set(chapter, []);
      }
      groupedEvents.get(chapter)?.push(event);
    });

    // Sort each chapter's events
    groupedEvents.forEach((events) => {
      events.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });

    const chapters = Array.from(groupedEvents.keys()).sort((a, b) => a - b);

    return { groupedEvents, chapters };
  }, [events]);

  // Memoize event handlers
  const handleMove = useCallback(
    (item: TimelineEvent, newChapter: number, currentChapter: number) => {
      if (newChapter !== currentChapter) {
        const targetChapterEvents = groupedEvents.get(newChapter) || [];
        const newOrder = targetChapterEvents.length;
        onUpdateEvent({
          ...item,
          chapter: newChapter,
          order: newOrder,
        });
      }
    },
    [groupedEvents, onUpdateEvent]
  );

  const handleDragEnd = useCallback(
    (data: TimelineEvent[]) => {
      const updates = data
        .map((event, index) => ({
          ...event,
          order: index,
        }))
        .filter((event) => event.order !== event.order);

      updates.forEach((event) => onUpdateEvent(event));
    },
    [onUpdateEvent]
  );

  const renderChapterEvents = useCallback(
    (chapter: number) => {
      return (
        <NestedDraggableFlatList
          data={groupedEvents.get(chapter) || []}
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
                onMove={(newChapter: number) =>
                  handleMove(item, newChapter, chapter)
                }
                onRemove={() => onRemoveEvent(item)}
              />
            </ScaleDecorator>
          )}
          onDragEnd={({ data }) => handleDragEnd(data)}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={5}
          updateCellsBatchingPeriod={50}
        />
      );
    },
    [
      groupedEvents,
      isEditable,
      projectId,
      onRemoveEvent,
      handleMove,
      handleDragEnd,
    ]
  );

  const renderChapter = useCallback(
    (chapter: number) => (
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
                finishedChapters.includes(chapter) && styles.filledChapterText,
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
    ),
    [finishedChapters, onChapterToggle, renderChapterEvents]
  );

  return (
    <View style={styles.container}>
      <View style={styles.timeline}>{chapters.map(renderChapter)}</View>
      {isEditable && <AddEventModal onAddEvent={onAddEvent} />}
    </View>
  );
};
