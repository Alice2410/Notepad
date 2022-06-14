import { Component, Input, OnInit } from '@angular/core';
import { Note, notes, noteTags, controlsNames } from '../db';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent {
  tags: string[] = [];
  tagsInputValue = '';
  controlsNames = controlsNames;

  noteForm = this.fb.group({
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

  constructor(private fb: FormBuilder) { }

  private getControl(controlName: string): AbstractControl {
    return this.noteForm.controls[controlName];
  }

  ngOnInit(): void {
    this.getControl(this.controlsNames.allTags).disable();
    if(this.noteForm.invalid) {
    }
  }

  addTag(): void {
    const tagValue = this.getControl(this.controlsNames.tag).value;
    const allTags = this.getControl(this.controlsNames.allTags);
    const tagStatus = this.getControl(this.controlsNames.tag).status;
    
    if(tagValue.length > 0 && tagStatus === 'VALID' && this.tags.indexOf(tagValue) === -1) {
      this.tags.push(`${tagValue}`);
      allTags.setValue(allTags.value + ` #${tagValue}`);
    }

    this.getControl(this.controlsNames.tag).setValue('');
    
    
  }

  reset(...args: string[]): void {
    args.forEach((inputName) => {
      this.getControl(inputName).setValue('');
      this.tags = [];
    })
  }

  saveNote(): void {
    const tagsArray = this.getControl(this.controlsNames.allTags).value.split(' #').slice(1);
    const note: Note = {
      title: this.getControl(this.controlsNames.title).value,
      text: this.getControl(this.controlsNames.text).value,
      allTags: tagsArray,
      id: Math.ceil(Math.random() * 100000)
    };
    this.addTagsToDB(tagsArray)
    notes.push(note);
    this.reset(...Object.values(this.controlsNames));
  }

  addTagsToDB(tags: string[]): void {
    tags.forEach((tag) => {
      console.log(tag);
      
      if(noteTags.has(tag)) {
        let number = noteTags.get(tag) as number + 1;
        let newTag = noteTags.set(tag, number);  
      } else {
        let newTag = noteTags.set(tag, 1);
      }
    })
    
  }

}


