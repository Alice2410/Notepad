import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navLinks = [
    {
      name: 'New note',
      id: 'new-note'
    },
    {
      name: 'My notes',
      id: 'my-notes'
    },
    {
      name: 'Edit',
      id: 'edit',
    },
    {
      name: 'Deleted notes',
      id: 'deleted',
    },
    {
      name: 'ToDo',
      id: 'todo'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
