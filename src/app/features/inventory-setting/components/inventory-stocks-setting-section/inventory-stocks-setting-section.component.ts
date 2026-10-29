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
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { DemoprojTimepickerComponent } from '../../../../shared/components/demoproj-timepicker/demoproj-timepicker.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { filter, map, Observable, take, takeUntil } from 'rxjs';
import { timePickerFormatValidator } from '@app/shared/utils/time-picker-format-validator';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import * as CreateEditInventorySelectors from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.selectors';
import { InventoryType } from '../../../../shared/utils/enums/inventory-type.enum';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-inventory-stocks-setting-section',
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
    SvgCalendarComponent,
    DemoprojTimepickerComponent,
    DemoprojInputComponent,
    MatButtonModule,
    MatDividerModule,
    MatSlideToggleModule,
  ],
  providers: [DatePipe],
  templateUrl: './inventory-stocks-setting-section.component.html',
  styleUrl: './inventory-stocks-setting-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryStocksSettingSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  inventoryTypes: ValueCode[] = [
    { value: 'Upload code', code: InventoryType.UPLOAD_CODE },
    { value: 'Product', code: InventoryType.PRODUCT },
  ];
  imageNameUploaded: WritableSignal<string> = signal<string>('Upload file');

  brandOptions$: Observable<ValueCode[]> = this.store
    .select(CreateEditInventorySelectors.selectBrands)
    .pipe(
      map((brands) =>
        brands.map((brand) => ({
          value: brand.brand_name_thai,
          code: brand.brand_id.toString(),
        }))
      )
    );
  inventoryId$: Observable<number | undefined> = this.store.select(
    CreateEditInventorySelectors.selectInventoryId
  );

  get inventoryNameControl() {
    return this.formGroup?.get('inventory_name');
  }
  get descriptionControl() {
    return this.formGroup?.get('description');
  }
  get brandIdControl() {
    return this.formGroup?.get('brand_id');
  }
  get inventoryTypeControl() {
    return this.formGroup?.get('inventory_type');
  }
  get statusControl() {
    return this.formGroup?.get('status');
  }
  get expireDateControl() {
    return this.formGroup?.get('expire_date');
  }
  get expireTimeControl() {
    return this.formGroup?.get('expire_time');
  }

  currentDate = new Date();

  ngOnInit(): void {
    this.store.dispatch(CreateEditInventoryActions.getBrandOptions());
    this.reValidateForm();

    this.brandOptions$
      .pipe(
        filter((brands) => brands.length > 0 && this.formMode === 'create'),
        take(1)
      )
      .subscribe((brands) => {
        this.brandIdControl?.patchValue(brands[0].code, {
          emitEvent: false,
        });
      });

    this.inventoryId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((inventoryId) => {
        if (inventoryId) {
          this.brandIdControl?.disable();
          this.inventoryTypeControl?.disable();
        }
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

  reValidateForm() {
    this.expireTimeControl?.setValidators([
      Validators.required,
      timePickerFormatValidator,
      (control: AbstractControl) => this.expireTimeValidator(control),
    ]);
  }

  expireTimeValidator(control: AbstractControl): ValidationErrors | null {
    const formValue = this.formGroup?.value;
    const expireTimeValue = control.value;
    const expireDateValue = formValue?.expire_date;

    if (!expireDateValue || !expireTimeValue || this.formMode !== 'create') {
      return null;
    }

    if (!expireTimeValue?.trim()) {
      return { required: true };
    }

    const [expireHours, expireMinutes] = (expireTimeValue || '')
      .split(':')
      .map(Number);
    const expire_date_time = new Date(expireDateValue);
    expire_date_time.setHours(expireHours, expireMinutes, 0, 0);

    const currentDate = new Date();

    if (expire_date_time < currentDate) {
      return { invalidExpireTime: true };
    }

    return null;
  }
}
