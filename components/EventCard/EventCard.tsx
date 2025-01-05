import { Card, IconButton, Text } from "react-native-paper";
import { View } from "react-native";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";

import { TimelineEvent } from "@/types";
import { styles } from "./EventCard.styles";

interface EventCardProps {
  event: TimelineEvent;
  isEditable: boolean;
  projectId: string;
  onRemove: (event: TimelineEvent) => void;
}

export const EventCard = ({
  event,
  isEditable,
  projectId,
  onRemove,
}: EventCardProps) => {
  return (
    <Link href={`/project/${projectId}/event/${event.id}`} asChild>
      <TouchableOpacity>
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
      </TouchableOpacity>
    </Link>
  );
};
