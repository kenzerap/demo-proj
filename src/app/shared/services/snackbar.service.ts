import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';
import * as MessageHandlingActions from '@app/store/message-handling/message-handling.actions';
import { ToastMessageComponent } from '../components/toast-message/toast-message.component';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackBar = inject(MatSnackBar);
  private actions$ = inject(Actions);

  constructor() {
    this.actions$
      .pipe(ofType(MessageHandlingActions.pushMessage))
      .subscribe(({ messageData, duration }) => {
        this.snackBar.openFromComponent(ToastMessageComponent, {
          panelClass: 'demoproj-snack-bar',
          data: messageData,
          duration,
        });
      });
  }
}
