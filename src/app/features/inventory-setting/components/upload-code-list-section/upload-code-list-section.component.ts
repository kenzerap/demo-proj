import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Observable, of, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { DemoprojTableComponent } from '../../../../shared/components/demoproj-table/demoproj-table.component';
import { UploadCode } from '../../models/upload-code.model';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { UploadCodesColumns } from '../../constants/upload-codes-columns.const';
import { UploadCodeDialogComponent } from '../upload-code-dialog/upload-code-dialog.component';
import { CreateEditInventoryQueryParams } from '../../models/create-edit-inventory-query-params.model';
import { SvgDeleteComponent } from '../../../../shared/icons/svg-delete/svg-delete.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import { Actions, ofType } from '@ngrx/effects';
import { InventoryWarningDialogComponent } from '../inventory-warning-dialog/inventory-warning-dialog.component';
import * as CreateEditInventorySelectors from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.selectors';

@Component({
  selector: 'app-upload-code-list-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    SvgPlusComponent,
    DemoprojTableComponent,
    SvgDeleteComponent,
  ],
  providers: [DatePipe],
  templateUrl: './upload-code-list-section.component.html',
  styleUrl: './upload-code-list-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCodeListSectionComponent
  extends BaseComponent
  implements OnInit
{
  private dialog = inject(MatDialog);
  private store = inject(Store);
  private actions$ = inject(Actions);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  tableColumns: WritableSignal<TableColumn[]> = signal(UploadCodesColumns);

  uploadCodes$: Observable<UploadCode[]> = this.store.select(
    CreateEditInventorySelectors.selectUploadCodes
  );
  ngOnInit(): void {
    this.actions$
      .pipe(
        ofType(CreateEditInventoryActions.deleteUploadCodeSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(({ response }) => {
        if (!response.deleted) {
          this.dialog.open(InventoryWarningDialogComponent, {
            data: {
              linkedPrivileges: response.linked_privileges,
              title: `The code can't delete`,
              message:
                'This code is currently linked to an active privilege. To proceed with deletion, please deactivate the associated privilege first.',
            },
            autoFocus: false,
            width: '30rem',
          });
        } else {
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              message: 'The inventory stocks was updated',
              btnConfirmText: 'Close',
              hideConfirmIcon: true,
              type: 'success',
            },
            width: '25rem',
          });
        }
      });
  }

  openUploadCodeDialog() {
    const formValue = this.formGroup.getRawValue();
    const expireTime = this.formGroup.value.expire_time;
    const expireDate = this.formGroup.value.expire_date;

    const [expireHours, expireMinutes] = (expireTime || '')
      .split(':')
      .map(Number);
    const expire_date_time = new Date(expireDate);
    expire_date_time.setHours(expireHours, expireMinutes, 0, 0);

    const inventoryData: Partial<CreateEditInventoryQueryParams> = {
      inventory_name: formValue.inventory_name,
      description: formValue.description,
      brand_id: formValue.brand_id,
      inventory_type: formValue.inventory_type,
      status: formValue.status ? 'ACTIVE' : 'INACTIVE',
      expire_date_time: expire_date_time.toISOString(),
    };
    this.dialog.open(UploadCodeDialogComponent, {
      data: {
        inventoryData,
      },
      width: '36rem',
      autoFocus: false,
      disableClose: true,
    });
  }

  deleteUploadCode(rowData: UploadCode) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Codes?',
        message: `If you confirm, the system will immediately delete these codes from the database.`,
        btnCloseText: 'Cancel',
        btnConfirmText: 'Confirm',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          CreateEditInventoryActions.deleteUploadCode({
            upload_code_id: rowData.upload_code_id,
          })
        );
      }
    });
  }
}
