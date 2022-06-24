export interface Note {
  title: string;
  text: string;
  allTags: string[];
  id: number;
  key?: string;
}
 
export const notes: Note[] = [];

export const deletedNotes: Note[] = [];

export const noteTags = new Map<string, number>();

export const controlsNames = {
  title: 'title',
  text: 'text',
  tag: 'tag',
  allTags: 'allTags',
}

export interface ToDo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}
