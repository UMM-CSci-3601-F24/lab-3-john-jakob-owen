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
   * This constructor injects both an instance of `TodoService`
   * and an instance of `MatSnackBar` into this component.
   *
   * @param userService the `TodoService` used to get todos from the server
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {
    // Nothing here – everything is in the injection parameters.
  }


  getTodosFromServer() {

    this.todoService
    .getTodos()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({

        next: returnedTodos => {

          this.serverFilteredTodos.set(returnedTodos);

          this.updateFilter();
        },

        error: err => {
          if (err.error instanceof ErrorEvent) {
            this.errMsg = `Problem in the client – Error: ${err.error.message}`;
          } else {
            this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
          }
        },
      });
  }


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


  ngOnInit(): void {
    this.getTodosFromServer();
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

