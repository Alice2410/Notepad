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
  tags: string[] = [];
  editedNote: Note | undefined;
  tagsString: string = '';
  // noteId: number = 0;
  initialTagsValue: string = '';

  editNoteForm = this.fb.group({
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
    private fb: FormBuilder, 
    private fo: FormOperationsService,
    private route: ActivatedRoute,
    private arrOperations: ArrayOperationsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const noteId = this.getID(); 
    this.editedNote = this.findNoteById(noteId);   
    this.tags = this.editedNote.allTags; // зачем? передаю изначальное значение массива тэгов
    
    this.fo.getControl(this.editNoteForm, controlsNames.title).setValue(this.editedNote.title);
    this.fo.getControl(this.editNoteForm, controlsNames.text).setValue(this.editedNote.text);

    this.editedNote.allTags.forEach((tag) => {
      if(tag) {
        this.tagsString = this.tagsString + `#${tag} ` //составляет строку из тегов
      }
    });

    this.tagsString.trim();

    this.fo.getControl(this.editNoteForm, controlsNames.allTags).setValue(this.tagsString);// помещает значение в allTags 
    this.initialTagsValue = this.tagsString;// сохрвняет его для использования в checkTags()
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

  saveEdit(): void {  
    this.arrOperations.splice(this.editedNote, notes);

    if(this.editedNote) {
      Object.values(controlsNames).forEach((item) => {
        console.log(item, this.fo.getControl(this.editNoteForm, item).dirty);

        if(this.fo.getControl(this.editNoteForm, item).dirty) {
          const key = item as keyof Note;
          (this.editedNote as unknown as Record<typeof key, typeof key>)[key] = this.fo.getControl(this.editNoteForm, item).value;
        }
      });
     
      this.editedNote.allTags = this.checkTags();      
    }
    
    notes.push(this.editedNote!);
    this.editedNote = undefined;
    this.reset(...Object.values(controlsNames))
    setTimeout(() => {
      this.router.navigate(['/my-notes'])
    }, 2000)
    
  }

  addTag(): void {
    const tagValue = this.fo.getControl(this.editNoteForm, controlsNames.tag).value;
    const allTags = this.fo.getControl(this.editNoteForm, controlsNames.allTags);
    const tagStatus = this.fo.getControl(this.editNoteForm, controlsNames.tag).status;
    
    if(tagValue.length > 0 && tagStatus === 'VALID' && this.tags.indexOf(tagValue) === -1) {
      this.tags.push(`${tagValue}`);
      allTags.setValue(allTags.value.trim() + ` #${tagValue}`);
    }

    this.fo.getControl(this.editNoteForm, controlsNames.tag).setValue('');
  }

  reset(...args: string[]): void {
    args.forEach((inputName) => {
      this.fo.getControl(this.editNoteForm, inputName).setValue('');
      this.tags = [];
    })
  }

  checkTags (): string[] {
    let oldTagsArr = this.initialTagsValue.trim().split('#').map((tag) => {
      tag.trim();
      return tag.trim()
    });
    oldTagsArr.splice(0, 1);
  
    let newTags: string = this.fo.getControl(this.editNoteForm, 'allTags').value;
    let newTagsArr = newTags.trim().split('#').map((tag) => {
      tag.trim();
      return tag.trim()
    });
    newTagsArr.splice(0, 1);

    oldTagsArr.forEach((tag) => {
      console.log('delete: ', tag);
      
      if(noteTags.has(tag) && noteTags.get(tag)) {
        let tagCount = noteTags.get(tag) as number;

        if(tagCount > 1) {
          noteTags.set(tag, tagCount - 1)
        } else {
          noteTags.delete(tag)
        }
      }

      console.log(noteTags);
    })

    newTagsArr.forEach((tag) => {
      console.log('add: ', tag);

      if(noteTags.has(tag) && noteTags.get(tag)) {
        let tagCount = noteTags.get(tag) as number;
        noteTags.set(tag, tagCount + 1)
      } else {
        noteTags.set(tag, 1);
      }

      console.log(noteTags);
    })

    return newTagsArr;
  }

}
