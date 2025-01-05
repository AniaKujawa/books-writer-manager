import { Card, IconButton, Text } from "react-native-paper";
import { View } from "react-native";
import { TimelineEvent } from "@/types";
import { styles } from "./EventCard.styles";

interface EventCardProps {
  event: TimelineEvent;
  isEditable: boolean;
  onRemove: (event: TimelineEvent) => void;
}

export const EventCard = ({ event, isEditable, onRemove }: EventCardProps) => {
  return (
    <Card style={styles.cardContent}>
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
          {isEditable && (
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onRemove(event)}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
};
