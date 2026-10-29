import { CommonModule, DatePipe } from '@angular/common';
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
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseComponent } from '@app/shared/components/base/base.component';

import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { MasterListSectionComponent } from '../master-list-section/master-list-section.component';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { PackageSettingSectionComponent } from '../package-setting-section/package-setting-section.component';
import * as createCheckupPackageActions from '../../stores/create-edit-checkup-package/create-edit-checkup-package.actions';
import * as checkupPackageSelectors from '../../stores/create-edit-checkup-package/create-edit-checkup-package.selectors';
import { filter, Observable, takeUntil, merge } from 'rxjs';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CheckupPackage } from '../../models/checkup-package.model';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
@Component({
  selector: 'app-create-edit-home-screen',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MasterListSectionComponent,
    PackageSettingSectionComponent,
    HasPermissionsDirective,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-checkup-package.component.html',
  styleUrls: ['./create-edit-checkup-package.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditCheckupPackageomponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private hasPermissionService = inject(HasPermissionService);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.CheckupPackage,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);
  checkupPackageId: WritableSignal<number> = signal(0);
  checkupPackageDetail$: Observable<CheckupPackage | null> = this.store.select(
    checkupPackageSelectors.selectCheckupPackageDetail
  );

  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  createLoading$ = this.store.select(
    selectIsLoading(`createEditCheckupPackage`)
  );

  masterListForm: FormGroup = this.fb.group({
    package_name_th: ['', Validators.required],
    package_name_en: ['', Validators.required],
  });

  packageSettingForm: FormGroup = this.fb.group({
    name: ['', Validators.required, noSpacesValidatorAsync],
    description: ['', Validators.required, noSpacesValidatorAsync],
    published: [false],
  });

  /* istanbul ignore next */
  ngOnInit() {
    this.masterListForm.valueChanges.subscribe(() => {
      this.store.dispatch(
        createCheckupPackageActions.setFormDirty({ isDirty: true })
      );
    });
    this.packageSettingForm.valueChanges.subscribe(() => {
      this.store.dispatch(
        createCheckupPackageActions.setFormDirty({ isDirty: true })
      );
    });

    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['checkupPackageId']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.checkupPackageId.set(Number(params['checkupPackageId']));
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          createCheckupPackageActions.getCheckupPackageDetail({
            checkupPackageId: this.checkupPackageId(),
          })
        );
      });

    this.checkupPackageDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((checkupPackageDetail) => !!checkupPackageDetail)
      )
      .subscribe((checkupPackageDetail) => {
        this.masterListForm.patchValue({
          package_name_th: checkupPackageDetail.package_name_th,
          package_name_en: checkupPackageDetail.package_name_en,
        });
        this.packageSettingForm.patchValue({
          name: checkupPackageDetail.name,
          description: checkupPackageDetail.description,
          published: checkupPackageDetail.is_published,
        });

        this.masterListForm.markAsPristine();
        this.packageSettingForm.markAsPristine();

        setTimeout(() => {
          this.store.dispatch(
            createCheckupPackageActions.setFormDirty({
              isDirty: false,
            })
          );
        }, 0);
      });

    merge(
      this.masterListForm.valueChanges,
      this.packageSettingForm.valueChanges
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe(() => {
        this.store.dispatch(
          createCheckupPackageActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          createCheckupPackageActions.createCheckupPackageSuccess,
          createCheckupPackageActions.updateCheckupPackageSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          createCheckupPackageActions.setFormDirty({ isDirty: false })
        );
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The master data was created`
                : 'The master data was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'master-data-management',
            'checkup-package',
            'list',
          ]);
        });
      });
  }

  setFormMode(mode: 'create' | 'edit' | 'view') {
    this.formMode.set(mode);
    if (mode === 'edit') {
      this.enableAllForm();
    }
    setTimeout(() => {
      this.store.dispatch(
        createCheckupPackageActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.masterListForm.disable({ emitEvent: false });
    this.packageSettingForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.masterListForm.enable({ emitEvent: false });
    this.packageSettingForm.enable({ emitEvent: false });
  }

  /* istanbul ignore next */
  onSubmit() {
    const isValidForm =
      this.masterListForm.valid && this.packageSettingForm.valid;
    if (!isValidForm) {
      this.masterListForm.markAllAsTouched();
      this.packageSettingForm.markAllAsTouched();
      return;
    }
    const masterListFormValue = this.masterListForm.getRawValue();
    const packageSettingFormValue = this.packageSettingForm.getRawValue();
    const bodyQueryParams = {
      package_name_th: masterListFormValue.package_name_th,
      package_name_en: masterListFormValue.package_name_en,
      name: packageSettingFormValue.name,
      description: packageSettingFormValue.description,
      is_published: packageSettingFormValue.published,
    };
    if (this.formMode() === 'edit') {
      this.store.dispatch(
        createCheckupPackageActions.updateCheckupPackage({
          data: {
            ...bodyQueryParams,
            id: this.checkupPackageId(),
          },
        })
      );
    } else {
      this.store.dispatch(
        createCheckupPackageActions.createCheckupPackage({
          queryParams: bodyQueryParams,
        })
      );
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(createCheckupPackageActions.reset());
  }
}
