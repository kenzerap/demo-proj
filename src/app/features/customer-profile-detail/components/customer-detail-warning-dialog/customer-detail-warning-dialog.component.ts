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
  selector: 'app-customer-detail-warning-dialog',
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
  templateUrl: './customer-detail-warning-dialog.component.html',
  styleUrl: './customer-detail-warning-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailWarningDialogComponent {
  private router = inject(Router);
  private dialogRef = inject(
    MatDialogRef<CustomerDetailWarningDialogComponent>
  );
  data: {
    mobile_no?: string;
    dup_mobile_no?: {
      first_name: string;
      last_name: string;
      party_id: string;
    };
    security_no?: string;
    dup_security_no?: {
      first_name: string;
      last_name: string;
      party_id: string;
    };
    email?: string;
    dup_email?: {
      first_name: string;
      last_name: string;
      party_id: string;
    };
  } = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  navigateToDetail(party_id: string) {
    this.router.navigate([
      '/user-management',
      'customer-profile',
      party_id,
      'overview',
    ]);

    this.dialogRef.close('exitEditMode');
  }
}
