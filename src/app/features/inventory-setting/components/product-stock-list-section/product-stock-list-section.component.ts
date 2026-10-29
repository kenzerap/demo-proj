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
import { filter, Observable, of, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { DemoprojTableComponent } from '../../../../shared/components/demoproj-table/demoproj-table.component';
import { ProductStock } from '../../models/product-stock.model';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { ProductStocksColumns } from '../../constants/product-stocks-columns.const';
import { CreateEditInventoryQueryParams } from '../../models/create-edit-inventory-query-params.model';
import { SvgDeleteComponent } from '../../../../shared/icons/svg-delete/svg-delete.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import { Actions, ofType } from '@ngrx/effects';
import * as CreateEditInventorySelectors from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.selectors';
import { CreateEditProductStockDialogComponent } from '../create-edit-product-stock-dialog/create-edit-product-stock-dialog.component';
import { InventoryWarningDialogComponent } from '../inventory-warning-dialog/inventory-warning-dialog.component';
import { SvgEditComponent } from '@app/shared/icons/svg-edit/svg-edit.component';

@Component({
  selector: 'app-product-stock-list-section',
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
    SvgEditComponent,
  ],
  providers: [DatePipe],
  templateUrl: './product-stock-list-section.component.html',
  styleUrl: './product-stock-list-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductStockListSectionComponent
  extends BaseComponent
  implements OnInit
{
  private dialog = inject(MatDialog);
  private store = inject(Store);
  private actions$ = inject(Actions);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  tableColumns: WritableSignal<TableColumn[]> = signal(ProductStocksColumns);

  productStocks$: Observable<ProductStock[]> = this.store.select(
    CreateEditInventorySelectors.selectProductStocks
  );
  ngOnInit(): void {
    this.actions$
      .pipe(
        ofType(CreateEditInventoryActions.deleteProductStockSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(({ response }) => {
        if (!response.could_update_delete) {
          this.dialog.open(InventoryWarningDialogComponent, {
            data: {
              linkedPrivileges: response.linked_privileges,
              title: `The product stock can't delete`,
              message:
                'This product stock is currently linked to an active privilege. To proceed with deletion, please deactivate the associated privilege first.',
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

  openProductStockDialog(rowData?: ProductStock) {
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
    this.dialog.open(CreateEditProductStockDialogComponent, {
      data: {
        inventoryData,
        productStock: rowData,
      },
      width: '36rem',
      autoFocus: false,
      disableClose: true,
    });
  }

  deleteProductStock(rowData: ProductStock) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Product Stock?',
        message: `If you confirm, the system will immediately delete this product stock from the database.`,
        btnCloseText: 'Cancel',
        btnConfirmText: 'Confirm',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          CreateEditInventoryActions.deleteProductStock({
            product_stock_id: rowData.product_stock_id,
          })
        );
      }
    });
  }
}
