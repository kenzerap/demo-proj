import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { SvgCheckComponent } from '../../icons/svg-check/svg-check.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastMessageType } from '../../utils/enums/toast-message-type.enum';
import { ToastMessageData } from '../../models/toast-message-data.model';

@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [CommonModule, SvgCheckComponent, MatIconModule],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss',
})
export class ToastMessageComponent implements OnInit {
  data: ToastMessageData = inject(MAT_SNACK_BAR_DATA);
  matSnackBarRef = inject(MatSnackBarRef<ToastMessageComponent>);

  toastMessageType = ToastMessageType;

  ngOnInit(): void {}

  getColorIcon(): string {
    switch (this.data.type) {
      case ToastMessageType.SUCCESS:
        return '#10973E';
      case ToastMessageType.ERROR:
        return '#c72b29';
      case ToastMessageType.WARNING:
        return '#DE900E';

      default:
        return '';
    }
  }

  close() {
    this.matSnackBarRef.dismiss();
  }
}
