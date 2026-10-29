import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SvgWarningCircleComponent } from '../../../../shared/icons/svg-warning-circle/svg-warning-circle.component';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-edit-promocode-warning-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    SvgWarningCircleComponent,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './create-edit-promocode-warning-dialog.component.html',
  styleUrl: './create-edit-promocode-warning-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditPromocodeWarningDialogComponent {
  private router = inject(Router);
  private dialogRef = inject(
    MatDialogRef<CreateEditPromocodeWarningDialogComponent>
  );
  data: {
    promocode_id: number;
    promocode_name: string;
  } = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  navigateToDetail(promocode_id: number) {
    this.router.navigate([
      'privilege-management',
      'promocode-setting',
      'form',
      promocode_id,
      'view-edit',
    ]);

    this.dialogRef.close();
  }
}
