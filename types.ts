export interface Project {
  id: string;
  title: string;
  description: string;
  characters: Character[];
  timeline: TimelineEvent[];
  currentPosition: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  customFields: CustomField[];
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  chapter: number;
  order: number;
}
