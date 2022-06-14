import { Component, OnInit } from '@angular/core';
import { notes, Note, deletedNotes, noteTags } from '../db';
import { ArrayOperationsService } from '../array-operations.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.scss']
})
export class MyNotesComponent implements OnInit {
  any = 'any';
  notesForPage: Note[] = []
  noteTags = noteTags;
  noteTagsKeys: string[] = [];

  select = new FormControl('');

  constructor(
    private arrOperations: ArrayOperationsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('init page');
    
    this.notesForPage = notes;
    this.noteTagsKeys = this.makeTagsSelect();
    this.select.setValue('any');
  }

  deleteNote(note: Note) {
    console.log('want to delete note');
    console.log('have notes: ', notes);
    console.log('to delete: ', note);

    this.arrOperations.push(note, notes, deletedNotes); //проблема: 
                                                        //не удаляет заметку из notesForPage => она не исчезает с экрана
    this.filterNotes();
  
    console.log('notes for page arr now: ', this.notesForPage);
    console.log('notes  arr now: ', notes);
    console.log('deleted notes arr now: ', deletedNotes);
  }

  makeTagsSelect() {
    return Array.from(noteTags.keys());
  }

  filterNotes() {
    let tag = this.select.value;
    
    if(tag === 'any') {
      console.log(notes);
      
      this.notesForPage = notes;
      return;
    } 

    const notesForFilter = notes.filter((note) => {
      return note.allTags.includes(tag)
    });

    this.notesForPage = notesForFilter;
    console.log('filtered notes: ', notesForFilter);
    
  }
}
