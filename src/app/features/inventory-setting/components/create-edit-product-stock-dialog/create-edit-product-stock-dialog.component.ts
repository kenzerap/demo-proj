import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { Store } from '@ngrx/store';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '@app/shared/components/base/base.component';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import { CreateEditInventoryQueryParams } from '../../models/create-edit-inventory-query-params.model';
import { Actions, ofType } from '@ngrx/effects';
import { noSpacesValidator } from '@app/shared/utils/no-spaces-validator';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ProductStock } from '../../models/product-stock.model';

@Component({
  selector: 'app-create-edit-product-stock-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    DemoprojInputComponent,
  ],
  templateUrl: './create-edit-product-stock-dialog.component.html',
  styleUrl: './create-edit-product-stock-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditProductStockDialogComponent
  extends BaseComponent
  implements OnInit
{
  private dialogRef = inject(
    MatDialogRef<CreateEditProductStockDialogComponent>
  );
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  data: {
    inventoryData: Partial<CreateEditInventoryQueryParams>;
    productStock: ProductStock | null;
  } = inject(MAT_DIALOG_DATA);

  loading$ = this.store.select(selectIsLoading(`createInventory`));
  loadingCreateInventory$ = this.store.select(
    selectIsLoading(`createInventoryAndUpdateData`)
  );
  loadingProductStock$ = this.store.select(
    selectIsLoading(`createEditProductStock`)
  );

  productStockForm: FormGroup = this.fb.group({
    product_name: ['', [Validators.required, noSpacesValidator]],
    description: [''],
    quantity: ['', [Validators.required, Validators.min(0)]],
  });

  get productNameControl() {
    return this.productStockForm.get('product_name');
  }
  get descriptionControl() {
    return this.productStockForm.get('description');
  }
  get quantityControl() {
    return this.productStockForm.get('quantity');
  }

  ngOnInit(): void {
    this.productStockForm.patchValue(this.data.productStock || {});
    this.actions$
      .pipe(
        ofType(CreateEditInventoryActions.createEditProductStockSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(({ response }) => {
        this.dialogRef.close(response);
      });
  }

  onSubmit() {
    if (this.data.productStock) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Update Product stock?',
          message: `If you click to confirmed the system will updated the product stock list`,
          btnCloseText: 'Cancel',
          btnConfirmText: 'Confirm',
          type: 'warning',
        },
        width: '25rem',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.store.dispatch(
            CreateEditInventoryActions.createInventoryAndUpdateData({
              inventoryData: this.data.inventoryData,
              dataUpdated: {
                ...this.productStockForm.getRawValue(),
                product_stock_id: this.data.productStock?.product_stock_id,
              },
            })
          );
        }
      });
    } else {
      this.store.dispatch(
        CreateEditInventoryActions.createInventoryAndUpdateData({
          inventoryData: this.data.inventoryData,
          dataUpdated: this.productStockForm.getRawValue(),
        })
      );
    }
  }
}
