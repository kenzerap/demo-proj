import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SvgWarningCircleComponent } from '@app/shared/icons/svg-warning-circle/svg-warning-circle.component';
import { SvgSuccessCircleComponent } from '../../icons/svg-success-circle/svg-success-circle.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    SvgWarningCircleComponent,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    SvgSuccessCircleComponent,
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data: {
    title: string;
    message: string;
    btnCloseText: string;
    btnConfirmText: string;
    hideConfirmIcon: boolean;
    type: 'warning' | 'success';
  } = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
