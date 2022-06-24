import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { CreateNoteComponent } from './create-note/create-note.component';
import { MyNotesComponent } from './my-notes/my-notes.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DeletedNotesComponent } from './deleted-notes/deleted-notes.component';
import { EditNoteComponent } from './edit-note/edit-note.component';
import { ToDoComponent } from './todo/todo.component';

const routes: Routes = [
  {
    path: 'new-note',
    component: CreateNoteComponent,
    //title: 'New Note', //in Angular v14
  },
  {
    path: 'my-notes',
    // loadChildren: () => import
    component: MyNotesComponent,
  },
  {
    path: 'edit/:id',
    // loadChildren: () => import
    component: EditNoteComponent,
  },
  {
    path: 'deleted',
    // loadChildren: () => import
    component: DeletedNotesComponent,
    //title: 'My Notes',
  },
  {
    path: 'todo',
    component: ToDoComponent,
    //title: 'Not Found',
  },
  {
    path: '',
    component: MainContentComponent,
    pathMatch: 'full'
    //title: 'Main Page',
  },
  {
    path: '**',
    component: NotFoundComponent
    //title: 'Not Found',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  CreateNoteComponent, MainContentComponent, 
  MyNotesComponent, NotFoundComponent, DeletedNotesComponent,
  EditNoteComponent
]
