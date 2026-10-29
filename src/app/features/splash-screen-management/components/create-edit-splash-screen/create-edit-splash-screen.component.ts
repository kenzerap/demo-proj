import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
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
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { filter, merge, Observable, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { BaseSettingSectionComponent } from '../base-setting-section/base-setting-section.component';
import { CreateEditSplashScreenQueryParams } from '../../models/create-edit-splash-screen-query-params.model';
import * as CreateEditSplashScreenActions from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.actions';
import * as CreateEditSplashScreenSelectors from '@app/features/splash-screen-management/stores/create-edit-splash-screen/create-edit-splash-screen.selectors';
import { SplashScreenDetail } from '../../models/splash-screen-management.model';

@Component({
  selector: 'app-create-edit-splash-screen',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BaseSettingSectionComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-splash-screen.component.html',
  styleUrls: ['./create-edit-splash-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditSplashScreenComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private actions$ = inject(Actions);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);

  createLoading$ = this.store.select(selectIsLoading(`createSplashScreen`));
  updateLoading$ = this.store.select(selectIsLoading(`updateSplashScreen`));

  splashScreenDetail$: Observable<SplashScreenDetail | null> =
    this.store.select(CreateEditSplashScreenSelectors.selectSplashScreenDetail);

  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  splashScreenId: WritableSignal<number> = signal(0);

  baseSettingForm: FormGroup = this.fb.group({
    send_time_type: [TimePeriodType.SPECIFIC_TIME, Validators.required],
    start_date: [''],
    start_time: [''],
    isSetEndDate: [false],
    end_date: [''],
    end_time: [''],
    is_active: [false],
    name_en: ['', Validators.required, noSpacesValidatorAsync],
    name_th: ['', Validators.required, noSpacesValidatorAsync],
    description_en: ['', Validators.required, noSpacesValidatorAsync],
    description_th: ['', Validators.required, noSpacesValidatorAsync],
    display_order: ['', Validators.required],
    imageFile: ['', Validators.required],
    imageUrl: [''],
    imageName: [''],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['splashScreenId']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.splashScreenId.set(params['splashScreenId']);
        this.setFormMode('view');
        this.disableAllForm();

        this.store.dispatch(
          CreateEditSplashScreenActions.getSplashScreenDetail({
            id: this.splashScreenId(),
          })
        );
      });

    this.splashScreenDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((splashScreenDetail) => !!splashScreenDetail)
      )
      .subscribe((splashScreenDetail: SplashScreenDetail) => {
        this.baseSettingForm.patchValue({
          send_time_type: splashScreenDetail.publish_type,
          start_date: splashScreenDetail.start_date_time,
          start_time: this.datePipe.transform(
            splashScreenDetail.start_date_time,
            'HH:mm'
          ),
          isSetEndDate: !!splashScreenDetail.end_date_time,
          end_date: splashScreenDetail.end_date_time,
          end_time: this.datePipe.transform(
            splashScreenDetail.end_date_time,
            'HH:mm'
          ),
          is_active: splashScreenDetail.status === 'ACTIVE',
          name_en: splashScreenDetail.name_en,
          name_th: splashScreenDetail.name_th,
          description_en: splashScreenDetail.description_en,
          description_th: splashScreenDetail.description_th,
          display_order: splashScreenDetail.display_order,
        });

        this.baseSettingForm.patchValue({
          imageUrl: splashScreenDetail.image_data,
          imageName: splashScreenDetail.image,
          imageFile: splashScreenDetail.image_data,
        });

        this.baseSettingForm.markAsPristine();

        setTimeout(() => {
          this.store.dispatch(
            CreateEditSplashScreenActions.setFormDirty({
              isDirty: false,
            })
          );
        }, 0);
      });

    merge(this.baseSettingForm.valueChanges)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditSplashScreenActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditSplashScreenActions.createSplashScreenSuccess,
          CreateEditSplashScreenActions.updateSplashScreenSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditSplashScreenActions.setFormDirty({ isDirty: false })
        );

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The splash screen was created`
                : 'The splash screen was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'application-management',
            'splash-screen-management',
            'list',
          ]);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    this.baseSettingForm.get('start_time')?.updateValueAndValidity();

    if (!this.baseSettingForm.valid) {
      this.baseSettingForm.markAllAsTouched();
      return;
    }

    const isSpecificTime =
      this.baseSettingForm.value.send_time_type ===
      TimePeriodType.SPECIFIC_TIME;

    const startTime = this.baseSettingForm.value.start_time;
    const endTime = this.baseSettingForm.value.end_time;
    const startDate = this.baseSettingForm.value.start_date;
    const endDate = this.baseSettingForm.value.end_date;

    const [startHours, startMinutes] = (startTime || '').split(':').map(Number);
    const start_date_time = new Date(startDate);
    start_date_time.setHours(startHours, startMinutes, 0, 0);

    const [endHours, endMinutes] = (endTime || '').split(':').map(Number);
    const end_date_time = endDate ? new Date(endDate) : null;
    end_date_time?.setHours(endHours, endMinutes, 0, 0);

    const file = this.baseSettingForm.value.imageFile;

    const bodyQueryParams: Partial<CreateEditSplashScreenQueryParams> = {
      name_en: this.baseSettingForm.value.name_en,
      name_th: this.baseSettingForm.value.name_th,
      description_en: this.baseSettingForm.value.description_en,
      description_th: this.baseSettingForm.value.description_th,
      status: this.baseSettingForm.value.is_active ? 'ACTIVE' : 'INACTIVE',
      display_order: this.baseSettingForm.value.display_order ? Number(this.baseSettingForm.value.display_order) : 1,
      publish_type: this.baseSettingForm.value.send_time_type,
      start_date_time:
        isSpecificTime && startDate ? start_date_time.toISOString() : '',
      end_date_time:
        isSpecificTime && this.baseSettingForm.value.isSetEndDate && endDate
          ? end_date_time?.toISOString()
          : '',
    };

    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditSplashScreenActions.updateSplashScreen({
          id: this.splashScreenId(),
          data: bodyQueryParams,
          file: file.name ? file : null,
        })
      );
    } else {
      this.store.dispatch(
        CreateEditSplashScreenActions.createSplashScreen({
          data: bodyQueryParams,
          file: file,
        })
      );
    }
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    this.formMode.set(mode);

    if (mode === 'edit') {
      this.enableAllForm();
    }

    setTimeout(() => {
      this.store.dispatch(
        CreateEditSplashScreenActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditSplashScreenActions.resetAll());
  }
}
