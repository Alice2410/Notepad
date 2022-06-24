export interface Note {
  title: string;
  text: string;
  allTags: string[];
  id: number;
  key?: string;
}
 
export const notes: Note[] = [
  // {
  //   title: 'title',
  //   text: 'some text',
  //   allTags: ['tag'],
  //   id: 0,
  // }
];

export const deletedNotes: Note[] = [];

export const noteTags = new Map<string, number>();

export const controlsNames = {
  title: 'title',
  text: 'text',
  tag: 'tag',
  allTags: 'allTags',
}
