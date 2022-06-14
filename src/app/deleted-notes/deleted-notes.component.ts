import { Component, OnInit } from '@angular/core';
import { notes, Note, deletedNotes, noteTags } from '../db';
import { ArrayOperationsService } from '../array-operations.service';

@Component({
  selector: 'app-deleted-notes',
  templateUrl: './deleted-notes.component.html',
  styleUrls: ['./deleted-notes.component.scss']
})
export class DeletedNotesComponent implements OnInit {
  notes: Note[] = []

  constructor(private arrOperation: ArrayOperationsService) { }

  ngOnInit(): void {
    this.notes = deletedNotes;
  }

  restore(note: Note) {
    this.arrOperation.push(note, this.notes, notes);
  }

  permDelete(note: Note) {
    console.log('to delete: ', note);
    
    let deletedNote = this.arrOperation.splice(note, this.notes);
    console.log('deleted note: ', deletedNote);
    

    let tagsArr = note.allTags;
    tagsArr.forEach((tag) => {
      let notesWithTag = noteTags.get(tag);

      if(notesWithTag === 1) {
        noteTags.delete(tag);
      } else {
        notesWithTag!--
        noteTags.set(tag, notesWithTag!) 
      }
      
    })
    console.log(noteTags);
    console.log('notes now: ', this.notes);
    
  }
}
