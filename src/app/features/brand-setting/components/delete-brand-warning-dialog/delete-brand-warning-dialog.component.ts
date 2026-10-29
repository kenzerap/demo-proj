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
import { Brand } from '../../../../shared/models/brand-model';

@Component({
  selector: 'app-delete-brand-warning-dialog',
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
  templateUrl: './delete-brand-warning-dialog.component.html',
  styleUrl: './delete-brand-warning-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteBrandWarningDialogComponent {
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<DeleteBrandWarningDialogComponent>);
  data: {
    brands: Brand[];
  } = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  navigateToDetail(brandId: number) {
    this.router.navigate([
      'privilege-management',
      'brand-setting',
      'form',
      brandId,
      'view-edit',
    ]);

    this.dialogRef.close('navigateExit');
  }
}
