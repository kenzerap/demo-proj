import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { Customer } from '../../models/customer.model';
import { SvgBirthdayCakeComponent } from '@shared/icons/svg-birthday-cake/svg-birthday-cake.component';
import { SvgUsersComponent } from '@shared/icons/svg-users/svg-users.component';
import { SvgVerifiedUserComponent } from '@shared/icons/svg-verified-user/svg-verified-user.component';
import { SvgPhoneComponent } from '@shared/icons/svg-phone/svg-phone.component';
import { SvgCompassComponent } from '@shared/icons/svg-compass/svg-compass.component';
import { SvgCalendarComponent } from '@app/shared/icons/svg-calendar/svg-calendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule, MatSelectTrigger } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, of, takeUntil } from 'rxjs';
import * as customerDetailActions from '../../stores/customer-detail/customer-detail.actions';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { thaiIdCheck } from '@app/shared/utils/check-thai-id';
import {
  noSpacesValidator,
  noSpacesValidatorAsync,
} from '@app/shared/utils/no-spaces-validator';

@Component({
  selector: 'app-customer-detail-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    SvgBirthdayCakeComponent,
    SvgUsersComponent,
    SvgVerifiedUserComponent,
    SvgPhoneComponent,
    SvgCompassComponent,
    SvgCalendarComponent,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatSelectTrigger,
  ],
  providers: [DatePipe],
  templateUrl: './customer-detail-edit.component.html',
  styleUrl: './customer-detail-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailEditComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  private store = inject(Store);

  @Input() customerDetail!: Customer;

  @Input() set isSaveCustomerProfile(_value: boolean) {
    this.validateFormData();
  }

  @Output() dispatchUpdate = new EventEmitter<Partial<Customer>>();

  securityTypes: ValueCode[] = [
    { value: 'Thai ID Card', code: 'ID_CARD' },
    { value: 'Passport ID', code: 'PASSPORT' },
  ];

  mobileCodes: ValueCode[] = [{ value: '66', code: '66' }];
  selectedMobileCodeControl = new FormControl('66');
  currentDate = new Date();
  isFirstInit: WritableSignal<boolean> = signal(true);

  customerForm: FormGroup = this.fb.group({
    first_name: ['', Validators.required, noSpacesValidatorAsync],
    last_name: ['', Validators.required, noSpacesValidatorAsync],
    security_type: ['ID_CARD', Validators.required, noSpacesValidatorAsync],
    mobile_no: [
      '',
      [
        Validators.required,
        noSpacesValidator,
        Validators.pattern(/^\d+$/),
        (control: AbstractControl) => this.phoneValidator(control),
      ],
    ],
    email: ['', [Validators.required, Validators.email, noSpacesValidator]],
    security_no: [
      '',
      Validators.required,
      (control: AbstractControl) => this.securityNoValidator(control),
    ],
    birth_date: ['', Validators.required],
  });

  get firstNameControl() {
    return this.customerForm.get('first_name');
  }

  get lastNameControl() {
    return this.customerForm.get('last_name');
  }

  get mobileNoControl() {
    return this.customerForm.get('mobile_no');
  }

  get emailControl() {
    return this.customerForm.get('email');
  }

  get selectedSecurityTypeControl() {
    return this.customerForm.get('security_type');
  }

  get securityNoControl() {
    return this.customerForm.get('security_no');
  }

  get birthDateControl() {
    return this.customerForm.get('birth_date');
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.customerForm.patchValue(this.customerDetail, { emitEvent: false });

    this.customerForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(
          customerDetailActions.setEditFormDirty({ isDirty: true })
        );
      });

    this.selectedSecurityTypeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.securityNoControl?.updateValueAndValidity();
      });
  }

  getCustomerAddress(customerDetail: Customer): string {
    return `${customerDetail?.address ?? ''} ${
      customerDetail?.district?.district_th ?? ''
    } ${customerDetail?.sub_district?.sub_district_th ?? ''} ${
      customerDetail?.province?.province_th ?? ''
    } ${customerDetail?.postcode_info?.postcode ?? ''}`;
  }

  validateFormData() {
    if (this.customerForm.invalid && this.isFirstInit()) {
      this.isFirstInit.set(false);
      return;
    }

    if (this.customerForm.invalid) {
      this.customerForm.markAsDirty();
      this.customerForm.markAllAsTouched();
      return;
    }

    const customerDetail = {
      ...this.customerForm.value,
      birth_date: this.datePipe.transform(
        this.customerForm.value.birth_date,
        'yyyy-MM-dd'
      ),
    };
    this.dispatchUpdate.emit(customerDetail);
  }

  getSecurityTypeCode(securityTypeCode: string | null): string {
    return (
      this.securityTypes.find(
        (securityType) => securityType.code === securityTypeCode
      )?.value || ''
    );
  }

  securityNoValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const securityType = this.selectedSecurityTypeControl?.value;
    const value = control.value;

    if (value.trim() === '') {
      return of({ required: true });
    }

    if (securityType === 'ID_CARD' && !thaiIdCheck(value)) {
      return of({ invalidThaiIdCard: true });
    }

    return of(null);
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!!value && !isNaN(value) && value.length !== 10) {
      return { maxLength: true };
    }

    return null;
  }

  trimSpaces(controlName: string) {
    const value = this.customerForm.get(controlName)?.value || '';
    this.customerForm
      .get(controlName)
      ?.setValue(value.trim(), { emitEvent: false });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(
      customerDetailActions.setEditFormDirty({ isDirty: false })
    );
  }
}
