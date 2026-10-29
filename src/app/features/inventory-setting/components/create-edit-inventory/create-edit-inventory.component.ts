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
import { filter, Observable, takeUntil } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { TargetGroup } from '@app/shared/models/target-group.model';
import { TriggerEventType } from '@app/shared/utils/enums/trigger-event-type.enum';
import { InventorySummaryComponent } from '../inventory-summary/inventory-summary.component';
import { InventoryStocksSettingSectionComponent } from '../inventory-stocks-setting-section/inventory-stocks-setting-section.component';
import { CreateEditInventoryQueryParams } from '../../models/create-edit-inventory-query-params.model';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import * as CreateEditInventorySelectors from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.selectors';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';
import { InventoryType } from '../../../../shared/utils/enums/inventory-type.enum';
import { UploadCodeListSectionComponent } from '../upload-code-list-section/upload-code-list-section.component';
import { InventoryDetail } from '../../models/inventory-detail.model';
import { ProductStockListSectionComponent } from '../product-stock-list-section/product-stock-list-section.component';
import { InventoryWarningDialogComponent } from '../inventory-warning-dialog/inventory-warning-dialog.component';

@Component({
  selector: 'app-create-edit-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    InventoryStocksSettingSectionComponent,
    UploadCodeListSectionComponent,
    InventorySummaryComponent,
    ProductStockListSectionComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-inventory.component.html',
  styleUrls: ['./create-edit-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditInventoryComponent
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

  createLoading$ = this.store.select(selectIsLoading(`createEditInventory`));
  inventoryDetail$: Observable<InventoryDetail | null> = this.store.select(
    CreateEditInventorySelectors.selectInventoryDetail
  );

  targetGroups: WritableSignal<TargetGroup[]> = signal([]);
  triggerEventType = TriggerEventType;
  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  inventoryId: WritableSignal<number> = signal(0);
  tierSegmentIncludeExclude: WritableSignal<TierSegmentIncludeExclude[]> =
    signal([]);
  inventoryType = InventoryType;

  inventoryStocksSettingForm: FormGroup = this.fb.group({
    inventory_name: ['', Validators.required, noSpacesValidatorAsync],
    description: ['', Validators.required, noSpacesValidatorAsync],
    brand_id: [0, Validators.required],
    inventory_type: [InventoryType.UPLOAD_CODE, Validators.required],
    status: [false],
    expire_date: ['', Validators.required],
    expire_time: ['', Validators.required],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['inventory_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.inventoryId.set(params['inventory_id']);
        this.setFormMode('view');
        this.disableAllForm();
        this.store.dispatch(
          CreateEditInventoryActions.getInventoryDetail({
            inventory_id: this.inventoryId(),
          })
        );
      });
    this.inventoryDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((inventoryDetail) => !!inventoryDetail)
      )
      .subscribe((inventoryDetail: InventoryDetail) => {
        this.inventoryStocksSettingForm.patchValue({
          inventory_name: inventoryDetail?.inventory_name,
          description: inventoryDetail?.description,
          brand_id: inventoryDetail?.brand_id?.toString(),
          inventory_type: inventoryDetail?.inventory_type,
          status: inventoryDetail?.status === 'ACTIVE',
          expire_date: inventoryDetail?.expire_date_time,
          expire_time: this.datePipe.transform(
            inventoryDetail?.expire_date_time,
            'HH:mm'
          ),
        });

        this.inventoryStocksSettingForm.markAsPristine();
        setTimeout(() => {
          this.store.dispatch(
            CreateEditInventoryActions.setFormDirty({ isDirty: false })
          );
        }, 0);
      });

    this.inventoryStocksSettingForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditInventoryActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditInventoryActions.createInventorySuccess,
          CreateEditInventoryActions.updateInventorySuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditInventoryActions.setFormDirty({ isDirty: false })
        );

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The inventory stocks was created`
                : 'The inventory stocks was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'privilege-management',
            'inventory-setting',
            'list',
          ]);
        });
      });

    this.actions$
      .pipe(
        ofType(CreateEditInventoryActions.uploadCodeSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditInventoryActions.setFormDirty({ isDirty: false })
        );

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The inventory stocks was created`
                : 'The inventory stocks was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        if (this.formMode() === 'create') {
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate([
              'privilege-management',
              'inventory-setting',
              'list',
            ]);
          });
        }
      });

    this.actions$
      .pipe(
        ofType(CreateEditInventoryActions.createEditProductStockSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(({ response }) => {
        if (!response?.could_update_delete) {
          this.dialog.open(InventoryWarningDialogComponent, {
            data: {
              linkedPrivileges: response?.linked_privileges,
              title: `The Product stock can't update`,
              message:
                'This Product is currently linked to an active privilege. To proceed with update, please deactivate the associated privilege first.',
            },
            autoFocus: false,
            width: '30rem',
          });
        } else {
          this.store.dispatch(
            CreateEditInventoryActions.setFormDirty({ isDirty: false })
          );

          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              message:
                this.formMode() === 'create'
                  ? `The inventory stocks was created`
                  : 'The inventory stocks was updated',
              btnConfirmText: 'Close',
              hideConfirmIcon: true,
              type: 'success',
            },
            width: '25rem',
          });

          if (this.formMode() === 'create') {
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigate([
                'privilege-management',
                'inventory-setting',
                'list',
              ]);
            });
          }
        }
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    this.inventoryStocksSettingForm
      .get('expire_time')
      ?.updateValueAndValidity();
    // check validate
    const isValidForm = this.inventoryStocksSettingForm.valid;

    if (!isValidForm) {
      this.inventoryStocksSettingForm.markAllAsTouched();

      return;
    }

    const expireTime = this.inventoryStocksSettingForm.value.expire_time;
    const expireDate = this.inventoryStocksSettingForm.value.expire_date;

    const [expireHours, expireMinutes] = (expireTime || '')
      .split(':')
      .map(Number);
    const expire_date_time = new Date(expireDate);
    expire_date_time.setHours(expireHours, expireMinutes, 0, 0);

    const bodyQueryParams: Partial<CreateEditInventoryQueryParams> = {
      inventory_name: this.inventoryStocksSettingForm.value.inventory_name,
      description: this.inventoryStocksSettingForm.value.description,
      brand_id: this.inventoryStocksSettingForm.getRawValue().brand_id,
      inventory_type:
        this.inventoryStocksSettingForm.getRawValue().inventory_type,
      status: this.inventoryStocksSettingForm.value.status
        ? 'ACTIVE'
        : 'INACTIVE',
      expire_date_time: expire_date_time.toISOString(),
    };

    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditInventoryActions.updateInventory({
          data: { ...bodyQueryParams, inventory_id: this.inventoryId() },
        })
      );
    } else {
      this.store.dispatch(
        CreateEditInventoryActions.createInventory({
          data: bodyQueryParams,
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
        CreateEditInventoryActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.inventoryStocksSettingForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.inventoryStocksSettingForm.enable({ emitEvent: false });

    this.inventoryStocksSettingForm
      .get('brand_id')
      ?.disable({ emitEvent: false });
    this.inventoryStocksSettingForm
      .get('inventory_type')
      ?.disable({ emitEvent: false });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditInventoryActions.resetAll());
  }
}
