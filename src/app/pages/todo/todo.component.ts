import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { TodoService, TodoItem } from './todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, HttpClientModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodoService]
})
export class TodoComponent implements OnInit {
  todoItems: TodoItem[] = [];
  newTodoText: string = '';
  showAddPopup: boolean = false;
  nextId: number = 1;
  isLoading: boolean = true; // Add loading state

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    // Set loading state to true
    this.isLoading = true;

    // Subscribe to todos from the service
    this.todoService.getTodos().subscribe({
      next: (todos: TodoItem[]) => {
        this.todoItems = todos;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading todos:', error);
        this.isLoading = false;
      }
    });

    // Subscribe to nextId from the service
    this.todoService.getNextId().subscribe((id: number) => {
      this.nextId = id;
    });
  }

  addTodo(): void {
    if (this.newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: this.nextId,
        text: this.newTodoText,
        done: false
      };

      this.todoService.addTodo(newTodo).subscribe({
        next: () => {
          this.newTodoText = '';
          this.showAddPopup = false;
        },
        error: (error: any) => {
          console.error('Error adding todo:', error);
        }
      });
    }
  }

  toggleDone(item: TodoItem): void {
    const updatedItem = { ...item, done: !item.done };
    this.todoService.updateTodo(updatedItem).subscribe({
      error: (error: any) => {
        console.error('Error updating todo:', error);
        // Revert the change if the update fails
        item.done = !item.done;
      }
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      error: (error: any) => {
        console.error('Error deleting todo:', error);
      }
    });
  }

  openAddPopup(): void {
    this.showAddPopup = true;
  }

  closeAddPopup(): void {
    this.showAddPopup = false;
    this.newTodoText = '';
  }

  copyToClipboard(): void {
    const todoText = this.todoItems
      .map(item => `${item.done ? '✓ ' : '☐ '} ${item.text}`)
      .join('\n');

    navigator.clipboard.writeText(todoText)
      .then(() => {
        alert('Todo list copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  }

  // Handle the drop event for reordering todo items
  onDrop(event: CdkDragDrop<TodoItem[]>): void {
    moveItemInArray(this.todoItems, event.previousIndex, event.currentIndex);
    // Update the order in the service
    this.todoService.updateTodoOrder(this.todoItems);
  }
}
