import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormOperationsService {

  getControl(form: FormGroup ,controlName: string): AbstractControl {
    return form.controls[controlName];
  }

  constructor() { }
}
