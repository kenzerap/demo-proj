import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlEvent,
  FormGroup,
  ReactiveFormsModule,
  TouchedChangeEvent,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { SvgPointComponent } from '../../../../shared/icons/svg-point/svg-point.component';
import { SvgGiftBoxComponent } from '../../../../shared/icons/svg-gift-box/svg-gift-box.component';
import { SvgCalendarComponent } from '../../../../shared/icons/svg-calendar/svg-calendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, Observable, takeUntil } from 'rxjs';
import { AddPrivilegeDialogComponent } from '../add-privilege-dialog/add-privilege-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import * as CreateEditPromocodeActions from '../../stores/create-edit-promocode/create-edit-promocode.actions';
import * as CreateEditPromocodeSelectors from '@app/features/promocode-setting/stores/create-edit-promocode/create-edit-promocode.selectors';
import { Store } from '@ngrx/store';
import { requireDependValidator } from '@app/shared/utils/require-depend-validator';
import { PromocodeDetail } from '../../models/promocode-model';

@Component({
  selector: 'app-rewards-section',
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
    DemoprojInputComponent,
    SvgPointComponent,
    SvgGiftBoxComponent,
    SvgCalendarComponent,
    MatDatepickerModule,
    SvgPlusComponent,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './rewards-section.component.html',
  styleUrl: './rewards-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardsSectionComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private changeDetection = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  unicodeDetail$: Observable<PromocodeDetail | null> = this.store.select(
    CreateEditPromocodeSelectors.selectPromocodeDetail
  );

  get isPointControl() {
    return this.formGroup?.get('is_point');
  }
  get isPrivilegeControl() {
    return this.formGroup?.get('is_privilege');
  }
  get earningPointControl() {
    return this.formGroup?.get('earning_point');
  }
  get earningPointExpiryDateControl() {
    return this.formGroup?.get('earning_point_expiry_date');
  }
  get isAdvanceRewardControl() {
    return this.formGroup?.get('is_advance_reward');
  }
  get isSpecialConditionFraudUserControl() {
    return this.formGroup?.get('is_special_condition_fraud_user');
  }
  get fraudConditionPointControl() {
    return this.formGroup?.get('fraud_condition_point');
  }
  get fraudConditionPointExpireDateControl() {
    return this.formGroup?.get('fraud_condition_point_expire_date');
  }
  get privilegeControl() {
    return this.formGroup?.get('privilege');
  }

  currentDate = new Date();

  ngOnInit(): void {
    this.reValidateForm();

    this.store.dispatch(CreateEditPromocodeActions.getPrivileges());
    this.unicodeDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((unicodeDetail) => !!unicodeDetail)
      )
      .subscribe(() => {
        this.changeDetection.detectChanges();
      });

    this.isPointControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode !== 'view')
      )
      .subscribe(() => {
        this.earningPointControl?.reset();
        this.earningPointExpiryDateControl?.reset();
      });

    this.isPrivilegeControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode !== 'view')
      )
      .subscribe(() => {
        this.privilegeControl?.reset();
      });

    this.privilegeControl?.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: ControlEvent<any>) => {
        if (event instanceof TouchedChangeEvent) {
          this.changeDetection.detectChanges();
        }
      });

    this.isSpecialConditionFraudUserControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode !== 'view')
      )
      .subscribe(() => {
        this.fraudConditionPointControl?.reset();
        this.fraudConditionPointExpireDateControl?.reset();
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

  changeGroup(formControl: AbstractControl | null) {
    if (this.formMode === 'view') {
      return;
    }

    formControl?.patchValue(!formControl?.value);
    formControl?.markAsDirty();
  }

  openAddPrivilegeDialog() {
    const ref = this.dialog.open(AddPrivilegeDialogComponent, {
      data: {
        privilege: this.privilegeControl?.getRawValue(),
      },
      autoFocus: false,
      width: '55rem',
      disableClose: true,
    });

    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const { selectedItem } = result || {};
        if (selectedItem) {
          this.privilegeControl?.patchValue(selectedItem);

          this.changeDetection.detectChanges();
        }
      });
  }

  reValidateForm() {
    this.earningPointControl?.setValidators([
      (control) =>
        requireDependValidator(control, this.isPointControl?.value, true),
    ]);
    this.earningPointExpiryDateControl?.setValidators([
      (control) => requireDependValidator(control, this.isPointControl?.value),
    ]);

    this.privilegeControl?.setValidators([
      (control) =>
        requireDependValidator(control, this.isPrivilegeControl?.value),
    ]);

    this.fraudConditionPointControl?.setValidators([
      (control) =>
        requireDependValidator(
          control,
          this.isSpecialConditionFraudUserControl?.value,
          true
        ),
    ]);
    this.fraudConditionPointExpireDateControl?.setValidators([
      (control) =>
        requireDependValidator(
          control,
          this.isSpecialConditionFraudUserControl?.value
        ),
    ]);
  }
}
