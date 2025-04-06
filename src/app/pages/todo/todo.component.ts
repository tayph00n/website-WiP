import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  todoItems: TodoItem[] = [];
  newTodoText: string = '';
  showAddPopup: boolean = false;
  nextId: number = 1;

  addTodo(): void {
    if (this.newTodoText.trim()) {
      this.todoItems.push({
        id: this.nextId++,
        text: this.newTodoText,
        done: false
      });
      this.newTodoText = '';
      this.showAddPopup = false;
    }
  }

  toggleDone(item: TodoItem): void {
    item.done = !item.done;
  }

  deleteTodo(id: number): void {
    this.todoItems = this.todoItems.filter(item => item.id !== id);
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
  }
}
