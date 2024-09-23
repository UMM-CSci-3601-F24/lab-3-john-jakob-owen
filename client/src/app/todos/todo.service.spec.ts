
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  const testTodos: Todo[] = [
  {
    _id: '58895985a22c04e761776d54',
    owner: 'Blanche',
    status: false,
    body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
    category: 'software design',
  },
  {
    _id: '58895985c1849992336c219b',
    owner: 'Fry',
    status: false,
    body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
    category: 'video games',
  },
  {
    _id: '58895985ae3b752b124e7663',
    owner: 'Fry',
    status: true,
    body: 'Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.',
    category: 'homework',
  }
];
let todoService: TodoService;
let httpClient: HttpClient;
let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    todoService = new TodoService(httpClient);
  });

afterEach(() => {
  httpTestingController.verify();
});

describe('getTodos()', () => {
  it('calls `api/todos` when `getTodos()` is called with no parameters', () => {

    todoService.getTodos().subscribe(todos => expect(todos).toBe(testTodos));


    const req = httpTestingController.expectOne(todoService.todoUrl);

    expect(req.request.method).toEqual('GET');

    expect(req.request.params.keys().length).toBe(0);

    req.flush(testTodos);
  });

  describe('Calling getTodos() with parameters correctly forms the HTTP request', () => {


    it("correctly calls api/todos with filter parameter 'video games'", () => {
      todoService.getTodos({ category: 'video games' }).subscribe(todos => expect(todos).toBe(testTodos));


      const req = httpTestingController.expectOne(
        request => request.url.startsWith(todoService.todoUrl) && request.params.has('category')
      );


      expect(req.request.method).toEqual('GET');


      expect(req.request.params.get('category')).toEqual('video games');

      req.flush(testTodos);
    });

    it("correctly calls api/todos with filter parameter 'quis'", () => {
      todoService.getTodos({ body: 'quis' }).subscribe(todos => expect(todos).toBe(testTodos));


      const req = httpTestingController.expectOne(
        request => request.url.startsWith(todoService.todoUrl) && request.params.has('body')
      );


      expect(req.request.method).toEqual('GET');


      expect(req.request.params.get('body')).toEqual('quis');

      req.flush(testTodos);
    });

    it("correctly calls api/todos with filter parameter 'owner'", () => {
      todoService.getTodos({ owner: 'Blanche' }).subscribe(todos => expect(todos).toBe(testTodos));


      const req = httpTestingController.expectOne(
        request => request.url.startsWith(todoService.todoUrl) && request.params.has('owner')
      );


      expect(req.request.method).toEqual('GET');


      expect(req.request.params.get('owner')).toEqual('Blanche');

      req.flush(testTodos);
    });
 });
    });
    describe('filterTodos()', () => {

      it('filters by owner', () => {
        const todoOwner = 'Fry';
        const filteredTodos = todoService.filterTodos(testTodos, { owner: todoOwner });

        expect(filteredTodos.length).toBe(2);

        filteredTodos.forEach(todo => {
          expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
        });
      });

      it('filters by category', () => {
        const todoCategory = 'homework';
        const filteredTodos = todoService.filterTodos(testTodos, { category: todoCategory });

        expect(filteredTodos.length).toBe(1);

        filteredTodos.forEach(todo => {
          expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
  });
});
it('filters by body', () => {
  const todoBody = 'quis';
  const filteredTodos = todoService.filterTodos(testTodos, { body: todoBody });

  expect(filteredTodos.length).toBe(1);

  filteredTodos.forEach(todo => {
    expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
});
});
it('should limit the number of todos based on the todoLimit input', () => {
  const todoLimit = 2;
  const filteredTodos = todoService.limitTodos(testTodos, todoLimit);


  expect(filteredTodos.length).toBeLessThanOrEqual(todoLimit);
});

it('should throw an error if a negative limit number is provided', () => {
  expect(() => todoService.limitTodos(testTodos, -1)).toThrowError("Limit must be a non-negative number.");
});
});
});

