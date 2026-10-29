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
import { LinkedPrivileges } from '../../models/linked-privileges.model';

@Component({
  selector: 'app-inventory-warning-dialog',
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
  templateUrl: './inventory-warning-dialog.component.html',
  styleUrl: './inventory-warning-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryWarningDialogComponent {
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<InventoryWarningDialogComponent>);
  data: {
    linkedPrivileges: LinkedPrivileges[];
    title: string;
    message: string;
  } = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  navigateToDetail(privilegeId: number) {
    this.router.navigate([
      'privilege-management',
      'privilege-setting',
      'form',
      privilegeId,
      'view-edit',
    ]);

    this.dialogRef.close('navigateExit');
  }
}
