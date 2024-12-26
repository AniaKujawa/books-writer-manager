export interface Project {
  id: string;
  title: string;
  characters: Character[];
  timeline: TimelineEvent[];
  currentPosition: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  chapter: number;
  position: number;
}
