import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { Store } from '@ngrx/store';
import * as CreateEditPrivilegeActions from '../../stores/create-edit-privilege/create-edit-privilege.actions';
import * as createEditPrivilegeSelectors from '../../stores/create-edit-privilege/create-edit-privilege.selectors';
import { MatDialog } from '@angular/material/dialog';
import { AddInventoryDialogComponent } from '../add-inventory-dialog/add-inventory-dialog.component';
import { filter, Observable, takeUntil } from 'rxjs';
import {
  addInventoryTabs,
  InventoryTabCode,
} from '../../constants/add-inventory-tabs.const';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { PrivilegeDetail } from '../../models/privilege-setting-model';
import { InventoryType } from '@app/shared/utils/enums/inventory-type.enum';

@Component({
  selector: 'app-inventory-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    SvgPlusComponent,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './inventory-section.component.html',
  styleUrl: './inventory-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorySectionComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private changeDetection = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  unitOptions: ValueCode[] = [{ code: 'POINT', value: 'Point' }];

  privilegeDetail$: Observable<PrivilegeDetail | null> = this.store.select(
    createEditPrivilegeSelectors.selectPrivilegeDetail
  );

  get inventoryControl() {
    return this.formGroup?.get('inventory');
  }
  get quantityControl() {
    return this.formGroup?.get('quantity');
  }
  get codeTypeControl() {
    return this.formGroup?.get('codeType');
  }

  ngOnInit(): void {
    this.store.dispatch(
      CreateEditPrivilegeActions.getUploadCodeInventories({
        queryParams: {
          page: 0,
          size: 999,
          inventory_type: InventoryType.UPLOAD_CODE,
        },
      })
    );
    this.store.dispatch(
      CreateEditPrivilegeActions.getProductInventories({
        queryParams: {
          page: 0,
          size: 999,
          inventory_type: InventoryType.PRODUCT,
        },
      })
    );

    this.privilegeDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((privilegeDetail) => !!privilegeDetail?.inventory?.inventory_id)
      )
      .subscribe((privilegeDetail) => {
        const inventoryDetail =
          privilegeDetail?.inventory.inventory_details || null;
        let codeType = InventoryTabCode.CodeUploaded;

        switch (inventoryDetail?.inventory_type) {
          case InventoryType.UPLOAD_CODE:
            codeType = InventoryTabCode.CodeUploaded;
            break;
          case InventoryType.PRODUCT:
            codeType = InventoryTabCode.Product;
            break;

          default:
            codeType = InventoryTabCode.CodeUploaded;
            break;
        }

        this.formGroup.patchValue({
          quantity: privilegeDetail?.inventory?.quantity,
          codeType,
          inventory: inventoryDetail,
        });

        this.changeDetection.detectChanges();
      });
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  openAddInventoryDialog() {
    const ref = this.dialog.open(AddInventoryDialogComponent, {
      data: {
        ...this.formGroup.getRawValue(),
      },
      autoFocus: false,
      width: '55rem',
      disableClose: true,
    });

    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const { selectedItem, quantity, codeType } = result || {};
        if (selectedItem && quantity && codeType) {
          this.formGroup.patchValue({
            inventory: selectedItem,
            quantity,
            codeType,
          });

          this.changeDetection.detectChanges();
        }
      });
  }

  getCodeTypeName() {
    const codeType = this.codeTypeControl?.getRawValue();
    return addInventoryTabs.find((item) => item.code === codeType)?.value;
  }
}
