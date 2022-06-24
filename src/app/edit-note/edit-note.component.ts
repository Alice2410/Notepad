import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { controlsNames, Note, notes, noteTags } from '../db';
import { FormOperationsService } from '../form-operations.service';
import { ActivatedRoute } from '@angular/router';
import { ArrayOperationsService } from '../array-operations.service';
import {Router} from "@angular/router"


@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {
  editedNoteTagsArr: string[] = [];
  editedNote: Note | undefined;
  initialTagsString: string = '';
  
  editNoteForm = this.formBuilder.group({
    title: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9 .,!()]*')
    ]],
    text: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9 .,!()\n]*')
    ]],
    tag: ['', [
      Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9 .,!()-_+=@\n]*')
    ]],
    allTags: [''],
  });

  constructor(
    private formBuilder: FormBuilder, 
    private formOperations: FormOperationsService,
    private route: ActivatedRoute,
    private arrOperations: ArrayOperationsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const noteId = this.getID(); 
    this.editedNote = this.findNoteById(noteId);  
    const tagsString = this.makeTagsString(); 
    this.editedNoteTagsArr = this.editedNote.allTags; 
    
    this.formOperations.getControl(this.editNoteForm, controlsNames.title).setValue(this.editedNote.title);
    this.formOperations.getControl(this.editNoteForm, controlsNames.text).setValue(this.editedNote.text);
    this.formOperations.getControl(this.editNoteForm, controlsNames.allTags).setValue(tagsString);
  }

  saveEdit(): void { 
    this.arrOperations.splice(this.editedNote, notes);

    if(this.editedNote){
      const newTags: string = this.formOperations.getControl(this.editNoteForm, 'allTags').value;
      this.editedNote.allTags = this.makeTagsArr(newTags);

      Object.values(controlsNames).forEach((item) => {
        const control = this.formOperations.getControl(this.editNoteForm, item);
        const key = item as keyof Note;
        
        if(control.dirty) {
          (this.editedNote as unknown as Record<typeof key, typeof key>)[key] = control.value;
        }
      });    

      this.deleteOldTags()
      this.setNewTags(this.editedNote.allTags);
    }
    
    notes.push(this.editedNote!);
    this.reset(...Object.values(controlsNames));
    this.editedNote = undefined;
    setTimeout(() => { this.router.navigate(['/my-notes']) }, 1000);
  }

  addNewTag(): void {
    const tagValue = this.formOperations.getControl(this.editNoteForm, controlsNames.tag).value;
    const allTags = this.formOperations.getControl(this.editNoteForm, controlsNames.allTags);
    const tagStatus = this.formOperations.getControl(this.editNoteForm, controlsNames.tag).status;
    
    if(tagValue.length > 0 && tagStatus === 'VALID' && this.editedNoteTagsArr.indexOf(tagValue) === -1) {
      this.editedNoteTagsArr.push(`${tagValue}`);
      allTags.setValue(allTags.value.trim() + ` #${tagValue}`);
    }

    this.formOperations.getControl(this.editNoteForm, controlsNames.tag).setValue('');
  }

  getID(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  findNoteById(id: number): Note {
    return notes.filter((note) => {
      if(note && note.id === id) {
        return note;
      }

      return;
    })[0];
  }

  reset(...args: string[]): void {
    args.forEach((inputName) => {
      this.formOperations.getControl(this.editNoteForm, inputName).setValue('');
      this.editedNoteTagsArr = [];
    })
  }

  deleteOldTags(): void {
    const oldTagsArr = this.makeTagsArr(this.initialTagsString);
    oldTagsArr.forEach((tag) => {      
      if(noteTags.has(tag) && noteTags.get(tag)) {
        const tagCount = noteTags.get(tag) as number;
        (tagCount > 1) ? noteTags.set(tag, tagCount - 1) : noteTags.delete(tag);
      }
    })
  }

  setNewTags(newTagsArr: string[]): void {
    newTagsArr.forEach((tag) => {
      const tagCount = noteTags.get(tag);
      tagCount ? noteTags.set(tag, tagCount + 1) : noteTags.set(tag, 1);
    })
  }

  makeTagsString(): string {
    let tagsString = '';

    this.editedNote!.allTags.forEach((tag) => {
      if(tag) {
        tagsString = tagsString + `#${tag} `;
      }
    });

    tagsString.trim();
    this.initialTagsString = tagsString;

    return tagsString;
  }

  private makeTagsArr(tagString: string): string[] {
    let tagsArr = tagString.split('#').map((tag) => {
      return tag.trim()
    });
    tagsArr.splice(0,1);

    return tagsArr;
  }

}
