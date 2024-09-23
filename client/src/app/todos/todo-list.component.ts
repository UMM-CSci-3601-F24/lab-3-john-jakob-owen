import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from './todo';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  MatNavList,
  MatListSubheaderCssMatStyler,
  MatListItem,
  MatListItemAvatar,
  MatListItemTitle,
  MatListItemLine,
} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint, MatError } from '@angular/material/form-field';
import { TodoService } from './todo.service';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
/**
 * A component that displays a list of users, either as a grid
 * of cards or as a vertical list.
 *
 * The component supports local filtering by name and/or company,
 * and remote filtering (i.e., filtering by the server) by
 * role and/or age. These choices are fairly arbitrary here,
 * but in "real" projects you want to think about where it
 * makes the most sense to do the filtering.
 */
@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: [],
  providers: [],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatExpansionModule,
    MatFormField,
    MatLabel,
    MatIconModule,
    MatInput,
    FormsModule,
    MatHint,
    MatSelect,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    MatRadioModule,
    MatNavList,
    MatListSubheaderCssMatStyler,
    MatListItem,
    RouterLink,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
    MatError,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class TodoListComponent implements OnInit, OnDestroy {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredTodos: WritableSignal<Todo[]> = signal([]);
  public filteredTodos: WritableSignal<Todo[]> = signal([]);

  public todoOwner: string;
  public todoStatus: boolean;
  public todoCategory: string;
  public todoBody: string;
  public todoLimit: number = 0;

  errMsg = '';
  private ngUnsubscribe = new Subject<void>();



  /**
   * This constructor injects both an instance of `UserService`
   * and an instance of `MatSnackBar` into this component.
   *
   * @param userService the `UserService` used to get users from the server
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {
    // Nothing here – everything is in the injection parameters.
  }

  /**
   * Get the users from the server, filtered by the role and age specified
   * in the GUI.
   */
  getTodosFromServer() {
    // A user-list-component is paying attention to userService.getUsers()
    // (which is an Observable<User[]>).
    // (For more on Observable, see: https://reactivex) = .io/documentation/observable.html)
    this.todoService
    .getTodos()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        // Next time we see a change in the Observable<User[]>,
        // refer to that User[] as returnedUsers here and do the steps in the {}
        next: returnedTodos => {
          // First, update the array of serverFilteredUsers to be the User[] in the observable
          this.serverFilteredTodos.set(returnedTodos);
          // Then update the filters for our client-side filtering as described in this method
          this.updateFilter();
        },
        // If we observe an error in that Observable, put that message in a snackbar so we can learn more
        error: err => {
          if (err.error instanceof ErrorEvent) {
            this.errMsg = `Problem in the client – Error: ${err.error.message}`;
          } else {
            this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
          }
        },
      });
  }

  /**
   * Called when the filtering information is changed in the GUI so we can
   * get an updated list of `filteredUsers`.
   */
  public updateFilter() {
    console.log('Updating the filter; this.todoStatus = ' + this.todoStatus);
    console.log(typeof(this.todoStatus));
    this.filteredTodos.set(this.todoService.filterTodos(this.serverFilteredTodos(), {
      owner: this.todoOwner,
      body: this.todoBody,
      status: this.todoStatus,
      category: this.todoCategory,
    }));
    if (this.todoLimit > 0) {
      this.filteredTodos.set(this.todoService.limitTodos(this.filteredTodos(), this.todoLimit));
  }

}

  /**
   * Starts an asynchronous operation to update the users list
   */
  ngOnInit(): void {
    this.getTodosFromServer();
  }

  /**
   * When this component is destroyed, we should unsubscribe to any
   * outstanding requests.
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

