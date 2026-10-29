import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SvgCalendarComponent } from '../../../../shared/icons/svg-calendar/svg-calendar.component';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { filter, map, Observable, take } from 'rxjs';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { selectUserGroups } from '../../stores/account-setting/account-setting.selectors';
import * as AccountSettingsActions from '../../stores/account-setting/account-setting.actions';

@Component({
  selector: 'app-create-user-account',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    DemoprojInputComponent,
    MatDividerModule,
  ],
  templateUrl: './create-user-account.component.html',
  styleUrl: './create-user-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserAccountComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateUserAccountComponent>);

  loading$ = this.store.select(selectIsLoading(`createUserAccount`));
  isSubmitted = false;

  createUserAccountForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    group_id: ['', Validators.required],
    status: ['ACTIVE'],
  });

  statusOptions: ValueCode[] = [
    { value: 'Active', code: 'ACTIVE' },
    { value: 'Inactive', code: 'INACTIVE' },
  ];

  userGroupOptions$: Observable<ValueCode<number>[]> = this.store
    .select(selectUserGroups)
    .pipe(
      map((groups) => {
        return groups.map((group) => ({
          value: group.name,
          code: group.groupId,
        }));
      })
    );

  get emailControl() {
    return this.createUserAccountForm.get('email');
  }

  get groupIdControl() {
    return this.createUserAccountForm.get('group_id');
  }

  get statusControl() {
    return this.createUserAccountForm.get('status');
  }

  ngOnInit(): void {
    this.loading$
      .pipe(
        filter((loading) => !loading && this.isSubmitted),
        take(1)
      )
      .subscribe(() => {
        this.dialogRef.close();
      });

    this.store.dispatch(AccountSettingsActions.getGroups());

    this.userGroupOptions$
      .pipe(
        filter((userGroups) => userGroups.length > 0),
        take(1)
      )
      .subscribe((options) => {
        this.groupIdControl?.patchValue(options[0]?.code);
      });
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode<any>[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  onSubmit() {
    if (this.createUserAccountForm.invalid) {
      this.createUserAccountForm.markAllAsTouched();
      return;
    }

    this.isSubmitted = true;
    this.store.dispatch(
      AccountSettingsActions.createUserAccount({
        queryParams: this.createUserAccountForm.value,
      })
    );
  }
}
