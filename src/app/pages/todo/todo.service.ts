import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/todos';
  private todoItemsSubject = new BehaviorSubject<TodoItem[]>([]);
  todoItems$ = this.todoItemsSubject.asObservable();
  private nextIdSubject = new BehaviorSubject<number>(1);
  nextId$ = this.nextIdSubject.asObservable();
  private useLocalStorage = false;

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  private loadTodos(): void {
    // First try to load from API
    this.http.get<TodoItem[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading todos from API:', error);
          this.useLocalStorage = true;
          // Fall back to localStorage
          return this.getLocalTodos();
        })
      )
      .subscribe({
        next: (todos) => {
          this.todoItemsSubject.next(todos);
          // Find the highest ID to set nextId correctly
          if (todos.length > 0) {
            const maxId = Math.max(...todos.map(todo => todo.id));
            this.nextIdSubject.next(maxId + 1);
          }
        },
        error: (error: any) => {
          console.error('Error loading todos:', error);
        }
      });
  }

  private getLocalTodos(): Observable<TodoItem[]> {
    const todosJson = localStorage.getItem('todos');
    if (todosJson) {
      try {
        const todos = JSON.parse(todosJson);
        console.log('Loaded todos from localStorage:', todos);
        return of(todos);
      } catch (e) {
        console.error('Error parsing todos from localStorage:', e);
      }
    }
    return of([]);
  }

  private saveLocalTodos(todos: TodoItem[]): void {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  getTodos(): Observable<TodoItem[]> {
    return this.todoItems$;
  }

  getNextId(): Observable<number> {
    return this.nextId$;
  }

  addTodo(todo: TodoItem): Observable<TodoItem> {
    if (this.useLocalStorage) {
      // Add to local storage
      const currentTodos = this.todoItemsSubject.value;
      const updatedTodos = [...currentTodos, todo];
      this.todoItemsSubject.next(updatedTodos);
      this.saveLocalTodos(updatedTodos);
      this.nextIdSubject.next(this.nextIdSubject.value + 1);
      return of(todo);
    }

    // Add to API
    return this.http.post<TodoItem>(this.apiUrl, todo)
      .pipe(
        tap(() => {
          const currentTodos = this.todoItemsSubject.value;
          this.todoItemsSubject.next([...currentTodos, todo]);
          this.nextIdSubject.next(this.nextIdSubject.value + 1);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error adding todo to API, falling back to localStorage:', error);
          this.useLocalStorage = true;
          // Fall back to localStorage
          const currentTodos = this.todoItemsSubject.value;
          const updatedTodos = [...currentTodos, todo];
          this.todoItemsSubject.next(updatedTodos);
          this.saveLocalTodos(updatedTodos);
          this.nextIdSubject.next(this.nextIdSubject.value + 1);
          return of(todo);
        })
      );
  }

  updateTodo(todo: TodoItem): Observable<TodoItem> {
    if (this.useLocalStorage) {
      // Update in local storage
      const currentTodos = this.todoItemsSubject.value;
      const updatedTodos = currentTodos.map(item =>
        item.id === todo.id ? todo : item
      );
      this.todoItemsSubject.next(updatedTodos);
      this.saveLocalTodos(updatedTodos);
      return of(todo);
    }

    // Update in API
    return this.http.put<TodoItem>(`${this.apiUrl}/${todo.id}`, todo)
      .pipe(
        tap(() => {
          const currentTodos = this.todoItemsSubject.value;
          const updatedTodos = currentTodos.map(item =>
            item.id === todo.id ? todo : item
          );
          this.todoItemsSubject.next(updatedTodos);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating todo in API, falling back to localStorage:', error);
          this.useLocalStorage = true;
          // Fall back to localStorage
          const currentTodos = this.todoItemsSubject.value;
          const updatedTodos = currentTodos.map(item =>
            item.id === todo.id ? todo : item
          );
          this.todoItemsSubject.next(updatedTodos);
          this.saveLocalTodos(updatedTodos);
          return of(todo);
        })
      );
  }

  deleteTodo(id: number): Observable<any> {
    if (this.useLocalStorage) {
      // Delete from local storage
      const currentTodos = this.todoItemsSubject.value;
      const filteredTodos = currentTodos.filter(item => item.id !== id);
      this.todoItemsSubject.next(filteredTodos);
      this.saveLocalTodos(filteredTodos);
      return of({ message: 'Todo deleted' });
    }

    // Delete from API
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentTodos = this.todoItemsSubject.value;
          const filteredTodos = currentTodos.filter(item => item.id !== id);
          this.todoItemsSubject.next(filteredTodos);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error deleting todo from API, falling back to localStorage:', error);
          this.useLocalStorage = true;
          // Fall back to localStorage
          const currentTodos = this.todoItemsSubject.value;
          const filteredTodos = currentTodos.filter(item => item.id !== id);
          this.todoItemsSubject.next(filteredTodos);
          this.saveLocalTodos(filteredTodos);
          return of({ message: 'Todo deleted' });
        })
      );
  }

  updateTodoOrder(todos: TodoItem[]): void {
    this.todoItemsSubject.next([...todos]);
    if (this.useLocalStorage) {
      this.saveLocalTodos(todos);
    }
    // You could also implement a bulk update API endpoint if needed
  }
}
