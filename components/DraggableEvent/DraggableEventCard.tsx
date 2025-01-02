import { PanGestureHandler } from "react-native-gesture-handler";
import { Text, View, Pressable } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Card, IconButton } from "react-native-paper";
import { TimelineEvent } from "../../types";
import { styles } from "./DraggableEventCard.styles";

interface DraggableEventCardProps {
  event: TimelineEvent;
  onMove: (newChapter: number) => void;
  onRemove: (event: TimelineEvent) => void;
  onLongPress?: () => void;
  isActive?: boolean;
}

export const DraggableEventCard = ({
  event,
  onMove,
  onRemove,
  onLongPress,
  isActive,
}: DraggableEventCardProps) => {
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      // Calculate new chapter based on vertical position
      const newChapter = Math.max(
        1,
        Math.ceil(Math.abs(translateY.value) / 100)
      );
      if (newChapter !== event.chapter) {
        runOnJS(onMove)(newChapter);
      }
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Pressable
      onLongPress={onLongPress}
      style={[styles.cardContainer, isActive && styles.activeCard]}
    >
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.cardContent, animatedStyle]}>
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
      </PanGestureHandler>
    </Pressable>
  );
};
