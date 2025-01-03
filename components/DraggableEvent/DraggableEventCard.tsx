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

interface DraggableEventCardProps {
  event: TimelineEvent;
  onMove: (newChapter: number) => void;
  onRemove: (event: TimelineEvent) => void;
  onLongPress?: () => void;
  isActive?: boolean;
}

export const DraggableEventCard: React.FC<DraggableEventCardProps> = ({
  event,
  onMove,
  onRemove,
  onLongPress,
  isActive,
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
        <Card>
          <Card.Content>
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.description}>
                  {event.description.length > 50
                    ? event.description.slice(0, 50) + "..."
                    : event.description}
                </Text>
              </View>
              <IconButton
                icon="delete"
                size={20}
                onPress={() => onRemove(event)}
              />
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </GestureDetector>
  );
};
