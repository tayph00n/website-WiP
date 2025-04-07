import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// @ts-ignore
import { TodoComponent } from './todo.component';

const routes: Routes = [
  {
    path: '',
    component: TodoComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule
  ]
})
export class TodoModule { }
