import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable, throttleTime, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  getPosts(url: string): Observable<object> {
    console.log('posts');
    
    return this.httpClient.get(url).pipe(timeout(5000))
  }
}
