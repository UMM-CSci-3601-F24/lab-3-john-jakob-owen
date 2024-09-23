import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockTodoService } from '../../testing/todo.service.mock';
import { Todo } from './todo';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('TodoListComponent', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TodoListComponent],

      providers: [{ provide: TodoService, useValue: new MockTodoService() }],
    });
  });


  beforeEach(waitForAsync(() => {

    TestBed.compileComponents().then(() => {

      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;

      fixture.detectChanges();
    });
  }));

  it('contains all the owners', () => {
    expect(todoList.serverFilteredTodos().length).toBe(3);
  });

  it('contains a  named "Blanche"', () => {
    expect(todoList.serverFilteredTodos().some((todo: Todo) => todo.owner === 'Blanche')).toBe(true);
  });

  it('contains a owner named "Fry"', () => {
    expect(todoList.serverFilteredTodos().some((todo: Todo) => todo.owner === 'Fry')).toBe(true);
  });

  it('doesn\'t contain a owner named "Garret"', () => {
    expect(todoList.serverFilteredTodos().some((todo: Todo) => todo.owner === 'Garret')).toBe(false);
  });
});


describe('TodoListComponent - Status Filtering', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TodoListComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    todoList = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('filter for status is true', () => {
    todoList.todoStatus = true;
    todoList.updateFilter();
    const filteredTodos = todoList.filteredTodos();

    expect(filteredTodos.every(todo => todo.status === true)).toBe(true);
  });

  it('filter for status is false', () => {
    todoList.todoStatus = false;
    todoList.updateFilter();
    const filteredTodos = todoList.filteredTodos();

    expect(filteredTodos.every(todo => todo.status === false)).toBe(true);
  });

  it('should return all todos when status is not set', () => {
    todoList.todoStatus = undefined;
    todoList.updateFilter();
    const filteredTodos = todoList.filteredTodos();

    expect(filteredTodos.length).toBe(todoList.serverFilteredTodos().length);
  });
});


describe('TodoListComponent - Limit Functionality', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TodoListComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    todoList = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('limit number of todos displayed', () => {
    todoList.todoLimit = 2;
    todoList.updateFilter();
    const filteredTodos = todoList.filteredTodos();

    expect(filteredTodos.length).toBe(2);
  });
  });

describe('Misbehaving Todo List', () => {
 let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoServiceStub: {
    getTodos: () => Observable<Todo[]>;
    getTodosFiltered: () => Observable<Todo[]>;
  };

  beforeEach(() => {

    todoServiceStub = {
      getTodos: () =>
        new Observable(observer => {
          observer.error('getTodos() Observer generates an error');
        }),
      getTodosFiltered: () =>
        new Observable(observer => {
          observer.error('getTodosFiltered() Observer generates an error');
        }),
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TodoListComponent],

      providers: [{ provide: TodoService, useValue: todoServiceStub }],
    });
  });


  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('fails to load todos if we do not set up a TodoListService', () => {

    expect(todoList.serverFilteredTodos());
  });
});

