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
  // The `UserListComponent` being tested
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  // Set up the `TestBed` so that it uses
  // a `MockUserService` in place of the real `UserService`
  // for the purposes of the testing. We also have to include
  // the relevant imports and declarations so that the tests
  // can find all the necessary parts.
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, TodoListComponent],
      // providers:    [ UserService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      // This MockerUserService is defined in client/testing/user.service.mock.
      providers: [{ provide: TodoService, useValue: new MockTodoService() }],
    });
  });

  // This constructs the `userList` (declared
  // above) that will be used throughout the tests.
  beforeEach(waitForAsync(() => {
    // Compile all the components in the test bed
    // so that everything's ready to go.
    TestBed.compileComponents().then(() => {
      /* Create a fixture of the UserListComponent. That
       * allows us to get an instance of the component
       * (userList, below) that we can control in
       * the tests.
       */
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      /* Tells Angular to sync the data bindings between
       * the model and the DOM. This ensures, e.g., that the
       * `userList` component actually requests the list
       * of users from the `MockUserService` so that it's
       * up to date before we start running tests on it.
       */
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
/*
 * This test is a little odd, but illustrates how we can use stubs
 * to create mock objects (a service in this case) that be used for
 * testing. Here we set up the mock UserService (userServiceStub) so that
 * _always_ fails (throws an exception) when you request a set of users.
 *
 * So this doesn't really test anything meaningful in the context of our
 * code (I certainly wouldn't copy it), but it does illustrate some nice
 * testing tools. Hopefully it's useful as an example in that regard.
 */
describe('Misbehaving Todo List', () => {
 let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoServiceStub: {
    getTodos: () => Observable<Todo[]>;
    getTodosFiltered: () => Observable<Todo[]>;
  };

  beforeEach(() => {
    // stub UserService for test purposes
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
      // providers:    [ UserService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: TodoService, useValue: todoServiceStub }],
    });
  });

  // Construct the `userList` used for the testing in the `it` statement
  // below.
  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('fails to load todos if we do not set up a TodoListService', () => {
    // Since calling both getUsers() and getUsersFiltered() return
    // Observables that then throw exceptions, we don't expect the component
    // to be able to get a list of users, and serverFilteredUsers should
    // be undefined.
    expect(todoList.serverFilteredTodos());
  });
});

