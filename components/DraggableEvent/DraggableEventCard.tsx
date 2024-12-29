import { PanGestureHandler } from "react-native-gesture-handler";
import { Text } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Card } from "react-native-paper";
import { TimelineEvent } from "../../types";

interface DraggableEventCardProps {
  event: TimelineEvent;
  onMove: (newChapter: number) => void;
  onUpdateEvent: (event: TimelineEvent) => void;
}

export const DraggableEventCard = ({
  event,
  onMove,
  ...props
}: DraggableEventCardProps) => {
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      // Calculate new chapter based on vertical position
      const newChapter = Math.max(
        1,
        Math.ceil(Math.abs(translateY.value) / 100)
      );
      runOnJS(onMove)(event.id, newChapter);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>
        <Card {...props}>
          <Card.Content>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {event.title}
            </Text>
            <Text style={{ fontSize: 12 }}>
              {event.description.length > 50
                ? event.description.slice(0, 50) + "..."
                : event.description}
            </Text>
          </Card.Content>
        </Card>
      </Animated.View>
    </PanGestureHandler>
  );
};
