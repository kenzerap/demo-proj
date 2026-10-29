import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
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
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ValueCode } from '@app/shared/models/value-code.model';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { filter, Observable, takeUntil } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import {
  addInventoryTabs,
  InventoryTabCode,
} from '../../constants/add-inventory-tabs.const';
import { Inventory } from '@app/shared/models/inventory-model';
import * as createEditPrivilegeSelectors from '../../stores/create-edit-privilege/create-edit-privilege.selectors';
import { Store } from '@ngrx/store';
import { codeUploadedColumns } from '../../constants/code-uploaded-list-columns.const';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { productListColumns } from '../../constants/product-list-columns.const';

@Component({
  selector: 'app-add-inventory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    MatTabsModule,
    DemoprojTableComponent,
    MatButtonToggleModule,
    DemoprojInputComponent,
  ],
  templateUrl: './add-inventory-dialog.component.html',
  styleUrl: './add-inventory-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddInventoryDialogComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddInventoryDialogComponent>);
  data: {
    inventory: Inventory;
    quantity: number;
    codeType: InventoryTabCode;
  } = inject(MAT_DIALOG_DATA);

  tabs: WritableSignal<ValueCode<InventoryTabCode>[]> =
    signal(addInventoryTabs);
  activeTabCode: WritableSignal<InventoryTabCode> = signal(
    InventoryTabCode.CodeUploaded
  );

  selectedItem: WritableSignal<Inventory | null> = signal(null);
  inventoryTabCode = InventoryTabCode;

  codeUploadedTableColumns: WritableSignal<TableColumn[]> =
    signal(codeUploadedColumns);
  uploadCodeInventories: Inventory[] = [];
  uploadCodeInventories$: Observable<Inventory[]> = this.store.select(
    createEditPrivilegeSelectors.selectUploadCodeInventories
  );

  productListTableColumns: WritableSignal<TableColumn[]> =
    signal(productListColumns);
  productInventories: Inventory[] = [];
  productInventories$: Observable<Inventory[]> = this.store.select(
    createEditPrivilegeSelectors.selectProductInventories
  );

  addInventoryForm: FormGroup = this.fb.group({
    quantity: ['', [Validators.required, Validators.min(0)]],
  });

  get quantityControl() {
    return this.addInventoryForm?.get('quantity');
  }

  ngOnInit(): void {
    this.uploadCodeInventories$
      .pipe(
        filter((inventories) => inventories.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe((inventories) => {
        if (
          this.data.inventory &&
          this.data.codeType === InventoryTabCode.CodeUploaded
        ) {
          const activeInventory = inventories.find(
            (item) => item.inventory_id === this.data.inventory.inventory_id
          );
          const selectedInventory = activeInventory || this.data.inventory;
          this.selectedItem.set(selectedInventory || null);

          this.uploadCodeInventories = activeInventory
            ? inventories
            : [this.data.inventory, ...inventories];

          return;
        }

        this.uploadCodeInventories = inventories;
      });

    this.productInventories$
      .pipe(
        filter((inventories) => inventories.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe((inventories) => {
        if (
          this.data.inventory &&
          this.data.codeType === InventoryTabCode.Product
        ) {
          const activeInventory = inventories.find(
            (item) => item.inventory_id === this.data.inventory.inventory_id
          );
          const selectedInventory = activeInventory || this.data.inventory;
          this.selectedItem.set(selectedInventory || null);

          this.productInventories = activeInventory
            ? inventories
            : [this.data.inventory, ...inventories];

          return;
        }

        this.productInventories = inventories;
      });

    this.addInventoryForm.patchValue({
      quantity: this.data.quantity,
    });
    this.activeTabCode.set(this.data.codeType);
  }

  onSubmit() {
    if (!!this.selectedItem() && this.addInventoryForm.valid) {
      this.dialogRef.close({
        selectedItem: this.selectedItem(),
        quantity: this.addInventoryForm.value.quantity,
        codeType: this.activeTabCode(),
      });
    } else {
      this.addInventoryForm.markAllAsTouched();
    }
  }

  changeTab(code: InventoryTabCode) {
    this.activeTabCode.set(code);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSelectedItemsChange(event: {
    items: (Inventory | null)[];
    toggleItem: Inventory | null;
  }) {
    this.selectedItem.set(event.toggleItem);
  }
}
