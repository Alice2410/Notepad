import { AfterContentChecked, AfterViewChecked, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { from, Observable, of, Subscription } from 'rxjs';
import { PostsService } from '../posts.service';
import { mergeMap, map, tap  } from 'rxjs/operators';
import { ToDo } from '../db';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class ToDoComponent implements OnInit, OnDestroy {

  title: string = 'To Do';
  private url = 'https://jsonplaceholder.typicode.com/todos';
  posts$: Observable<any>;
  showFrom: number = 0;
  toDos!: any[];
  countOnPage = 23;
  sub: Subscription;
  
  constructor(private postsService: PostsService) { }
  
  ngOnInit(): void {
    setTimeout(() => this.getToDos(), 2000)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getToDos() {
    this.posts$ = this.postsService.getPosts(this.url);
    console.log(this.posts$);
    
    this.sub = this.posts$.subscribe((posts: ToDo[]) => {
        console.log(posts);
        this.toDos = posts as ToDo[];
      },
    )
    
    setTimeout(() => {
      console.log('subscription: ', this.toDos);
    }, 3000)
    
  }

  showPosts(posts: ToDo[]) {
    
    this.toDos = posts;
    
  }

  showNext() {
    this.showFrom = this.showFrom + this.countOnPage;
  }

  showPrev() {
    this.showFrom = this.showFrom - this.countOnPage;
  }

  checkBack() {
    return (this.showFrom === 0) ? true : false;
  }

  checkNext() {
    if(this.toDos) {
      console.log(this.showFrom);
      
      return ((this.showFrom + this.countOnPage) >= this.toDos.length) ? true : false;
    } else {
      return true
    }
  }
}
