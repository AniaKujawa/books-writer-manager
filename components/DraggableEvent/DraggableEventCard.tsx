import { Text, View } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { TimelineEvent } from "../../types";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { styles } from "./DraggableEventCard.styles";
import { EventCard } from "../EventCard";
import { memo } from "react";

interface DraggableEventCardProps {
  event: TimelineEvent;
  projectId: string;
  onMove: (newChapter: number) => void;
  onRemove: (event: TimelineEvent) => void;
  onLongPress?: () => void;
  isActive?: boolean;
  isEditable?: boolean;
}

export const DraggableEventCard: React.FC<DraggableEventCardProps> = memo(
  ({
    event,
    projectId,
    onMove,
    onRemove,
    onLongPress,
    isActive,
    isEditable = true,
  }) => {
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
      .onBegin(() => {
        if (onLongPress) {
          runOnJS(onLongPress)();
        }
      })
      .onUpdate((event) => {
        translateY.value = event.translationY;
      })
      .onEnd(() => {
        translateY.value = withSpring(0);
        const newChapter = Math.max(
          1,
          Math.ceil(Math.abs(translateY.value) / 100)
        );
        if (newChapter !== event.chapter) {
          runOnJS(onMove)(newChapter);
        }
      });

    const longPressGesture = Gesture.LongPress().onStart(() => {
      if (onLongPress) {
        runOnJS(onLongPress)();
      }
    });

    const gesture = Gesture.Race(panGesture, longPressGesture);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.cardContainer,
            isActive && styles.activeCard,
            animatedStyle,
          ]}
        >
          <EventCard
            event={event}
            isEditable={isEditable}
            projectId={projectId}
            onRemove={onRemove}
          />
        </Animated.View>
      </GestureDetector>
    );
  },
  (prevProps, nextProps) => {
    // Compare event properties
    if (prevProps.event.id !== nextProps.event.id) return false;
    if (prevProps.event.title !== nextProps.event.title) return false;
    if (prevProps.event.description !== nextProps.event.description)
      return false;
    if (prevProps.event.chapter !== nextProps.event.chapter) return false;
    if (prevProps.event.order !== nextProps.event.order) return false;

    // Compare other props
    if (prevProps.isActive !== nextProps.isActive) return false;
    if (prevProps.isEditable !== nextProps.isEditable) return false;
    if (prevProps.projectId !== nextProps.projectId) return false;

    return true;
  }
);
