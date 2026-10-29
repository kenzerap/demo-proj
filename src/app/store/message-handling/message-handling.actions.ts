import { createAction, props } from '@ngrx/store';
import { ToastMessageData } from 'src/app/shared/models/toast-message-data.model';

const prefix = '[Message Handling]';

export const pushMessage = createAction(
  `${prefix} Push Message`,
  props<{ messageData: ToastMessageData; duration?: number }>()
);
