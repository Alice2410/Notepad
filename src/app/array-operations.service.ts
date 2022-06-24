import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArrayOperationsService {

  constructor() { }

  getIndex <T>(item: T, arr: T[]): number {
    return arr.indexOf(item);
  }

  splice <T>(item: T, arr: T[]): T[] {
    const itemIndex = this.getIndex(item, arr);
    return arr.splice(itemIndex, 1);
  }

  push <T>(item: T, arr: T[], arrToAdd?: T[]): void {
    const items = this.splice(item, arr);
    
    if(arrToAdd) {
      arrToAdd.push(items[0]);
    }
  }
}
