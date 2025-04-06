import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { SiteInfoComponent } from './pages/site-info/site-info.component';
import { ContactComponent } from './pages/contact/contact.component';
import { TodoComponent } from './pages/todo/todo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'site-info', component: SiteInfoComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'todo', component: TodoComponent}
];
