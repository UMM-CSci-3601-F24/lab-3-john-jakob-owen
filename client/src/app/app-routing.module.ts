import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { TodoListComponent } from './todos/todo-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'users', component: UserListComponent, title: 'Users' },
  { path: 'users/:id', component: UserProfileComponent, title: 'User Profile' },
  { path: 'todos', component: TodoListComponent, title: 'Todos' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
