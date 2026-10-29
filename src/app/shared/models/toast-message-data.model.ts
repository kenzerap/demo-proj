import { ToastMessageType } from '../utils/enums/toast-message-type.enum';

export interface ToastMessageData {
  title: string;
  message: string;
  type: ToastMessageType;
}
