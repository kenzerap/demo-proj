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
import { filter, map, merge, Observable, takeUntil } from 'rxjs';
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
import { TargetGroupType } from '@app/shared/components/target-group-section/target-group-type.enum';
import { TriggerEventType } from '@app/shared/utils/enums/trigger-event-type.enum';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { DestinationCode } from '@app/shared/constants/destination-options.const';
import { targetGroupList } from '@app/shared/constants/target-group-list.const';
import { MobileBannerSettingPreviewComponent } from '../mobile-banner-setting-preview/mobile-banner-setting-preview.component';
import { BannerBaseSettingSectionComponent } from '../banner-base-setting-section/banner-base-setting-section.component';
import { TargetGroupSectionComponent } from '@app/shared/components/target-group-section/target-group-section.component';
import { SettingDisplayOnPageSectionComponent } from '../setting-display-on-page-section/setting-display-on-page-section.component';
import { BannerSettingDestinationSectionComponent } from '../banner-setting-destination-section/banner-setting-destination-section.component';
import { CreateEditBannerSettingQueryParams } from '../../models/create-edit-banner-setting-query-params.model';
import * as CreateEditBannerSettingActions from '@app/features/banner-setting/stores/create-edit-banner-setting/create-edit-banner-setting.actions';
import * as CreateEditBannerSettingSelectors from '@app/features/banner-setting/stores/create-edit-banner-setting/create-edit-banner-setting.selectors';
import { PreviewImage } from '../../models/preview-image.model';
import { BannerSettingDetail } from '../../models/banner-setting-model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';

@Component({
  selector: 'app-create-edit-banner-setting',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BannerBaseSettingSectionComponent,
    ReactiveFormsModule,
    MatCheckboxModule,
    TargetGroupSectionComponent,
    MatFormFieldModule,
    MobileBannerSettingPreviewComponent,
    SettingDisplayOnPageSectionComponent,
    BannerSettingDestinationSectionComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-banner-setting.component.html',
  styleUrls: ['./create-edit-banner-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditBannerSettingComponent
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

  createLoading$ = this.store.select(selectIsLoading(`createBannerSetting`));
  updateLoading$ = this.store.select(selectIsLoading(`updateBannerSetting`));
  previewImages$: Observable<PreviewImage[]> = this.store.select(
    CreateEditBannerSettingSelectors.selectPreviewImages
  );
  tierGroups$: Observable<TierGroup[]> = this.store.select(
    CreateEditBannerSettingSelectors.selectTierGroups
  );
  segmentGroups$: Observable<SegmentGroup[]> = this.store.select(
    CreateEditBannerSettingSelectors.selectSegmentGroups
  );

  bannerSettingDetail$: Observable<BannerSettingDetail | null> =
    this.store.select(
      CreateEditBannerSettingSelectors.selectBannerSettingDetail
    );

  targetGroups: WritableSignal<TargetGroup[]> = signal([]);
  pushNotificationType = TimePeriodType;
  triggerEventType = TriggerEventType;
  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  bannerSettingId: WritableSignal<number> = signal(0);
  bannerSettingDetail!: BannerSettingDetail;
  tierSegmentIncludeExclude: WritableSignal<TierSegmentIncludeExclude[]> =
    signal([]);

  baseSettingForm: FormGroup = this.fb.group({
    send_time_type: [TimePeriodType.SPECIFIC_TIME, Validators.required],
    start_date: [''],
    start_time: [''],
    published: [false],
    isSetEndDate: [false],
    end_date: [''],
    end_time: [''],
    bannerName: ['', Validators.required, noSpacesValidatorAsync],
    imageFile: ['', Validators.required],
    imageUrl: [''],
    imageName: [''],
  });

  targetGroupForm: FormGroup = this.fb.group({
    target_group_type: [TargetGroupType.ALL, Validators.required],
    target_group_id: [''],
  });

  settingDisplayOnPageForm: FormGroup = this.fb.group({
    pageId: ['', Validators.required],
  });

  settingDestinationForm: FormGroup = this.fb.group({
    destination_type: [DestinationCode.Privilege, Validators.required],
    destination_value: ['', Validators.required],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['bannerSettingId']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.bannerSettingId.set(params['bannerSettingId']);
        this.setFormMode('view');
        this.disableAllForm();

        this.store.dispatch(
          CreateEditBannerSettingActions.getBannerSettingDetail({
            id: this.bannerSettingId(),
          })
        );
      });

    this.bannerSettingDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((bannerSettingDetail) => !!bannerSettingDetail)
      )
      .subscribe((bannerSettingDetail: BannerSettingDetail) => {
        this.bannerSettingDetail = bannerSettingDetail;

        this.baseSettingForm.patchValue({
          send_time_type: bannerSettingDetail.publish_type,
          start_date: bannerSettingDetail.start_date_time,
          start_time: this.datePipe.transform(
            bannerSettingDetail.start_date_time,
            'HH:mm'
          ),
          published: bannerSettingDetail.is_published,
          isSetEndDate: !!bannerSettingDetail.end_date_time,
          end_date: bannerSettingDetail.end_date_time,
          end_time: this.datePipe.transform(
            bannerSettingDetail.end_date_time,
            'HH:mm'
          ),
          bannerName: bannerSettingDetail.banner_name,
        });

        this.baseSettingForm.patchValue({
          imageUrl: bannerSettingDetail.image_data,
          imageName: bannerSettingDetail.image,
          imageFile: bannerSettingDetail.image_data,
        });

        const target_group_id =
          bannerSettingDetail.target_group_id > 3
            ? 4
            : bannerSettingDetail.target_group_id;
        if (target_group_id === 4) {
          const items: TierSegmentIncludeExclude[] = [
            ...bannerSettingDetail.segment_list.map((segment) => {
              return {
                id: segment.id,
                type: 'segmentation',
                isInclude: segment.is_included,
                name: segment.name,
              };
            }),
            ...bannerSettingDetail.tier_list.map((tier) => {
              return {
                id: tier.id,
                type: 'tier',
                isInclude: tier.is_included,
                name: tier.name,
              };
            }),
          ];

          this.store.dispatch(
            CreateEditBannerSettingActions.setIncludeExcludeSegmentTier({
              items,
            })
          );
          this.tierSegmentIncludeExclude.set(items);
        }

        this.targetGroupForm.patchValue({
          target_group_id: target_group_id,
          target_group_type: this.targetGroups().find(
            (targetGroup) => targetGroup.id === target_group_id
          )?.code,
        });

        this.settingDisplayOnPageForm.patchValue({
          pageId: bannerSettingDetail.page_id.toString(),
        });

        this.settingDestinationForm.patchValue({
          destination_type: bannerSettingDetail.destination_type,
          destination_value: bannerSettingDetail.destination_value,
        });

        this.baseSettingForm.markAsPristine();
        this.targetGroupForm.markAsPristine();
        this.settingDisplayOnPageForm.markAsPristine();
        this.settingDestinationForm.markAsPristine();

        setTimeout(() => {
          this.store.dispatch(
            CreateEditBannerSettingActions.setFormDirty({
              isDirty: false,
            })
          );
        }, 0);
      });

    const targetGroups: TargetGroup[] = [...targetGroupList].map(
      (targetGroup) => {
        return {
          id: targetGroup.code,
          target_group_name: targetGroup.value,
          code: targetGroup.code,
        };
      }
    );
    this.targetGroups.set(targetGroups);

    const groupId = this.targetGroupForm.get('target_group_id')?.value || 1;
    this.targetGroupForm.patchValue(
      {
        ...this.targetGroupForm.getRawValue(),
        target_group_type: this.targetGroups().find(
          (targetGroup) => targetGroup.id === groupId
        )?.code,
      },
      { emitEvent: false }
    );

    this.store.dispatch(
      CreateEditBannerSettingActions.getTierGroups({
        page: 0,
        size: 999,
      })
    );

    this.store.dispatch(
      CreateEditBannerSettingActions.getSegmentGroups({
        page: 0,
        size: 999,
      })
    );

    merge(
      this.baseSettingForm.valueChanges,
      this.targetGroupForm.valueChanges,
      this.settingDisplayOnPageForm.valueChanges,
      this.settingDestinationForm.valueChanges
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe((value) => {
        this.store.dispatch(
          CreateEditBannerSettingActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditBannerSettingActions.createBannerSettingSuccess,
          CreateEditBannerSettingActions.updateBannerSettingSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditBannerSettingActions.setFormDirty({ isDirty: false })
        );

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The banner was created`
                : 'The banner was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'application-management',
            'banner-setting',
            'list',
          ]);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    const hasIncludeItem = this.tierSegmentIncludeExclude().some(
      (item) => item.isInclude
    );
    const isTargetGroup =
      this.targetGroupForm.value.target_group_type ===
      TargetGroupType.TARGET_GROUP;
    const isValidTargetGroupForm = isTargetGroup
      ? hasIncludeItem && this.targetGroupForm.valid
      : this.targetGroupForm.valid;

    // check validate
    const isValidForm =
      this.baseSettingForm.valid &&
      isValidTargetGroupForm &&
      this.settingDisplayOnPageForm.valid &&
      this.settingDestinationForm.valid;

    if (!isValidForm) {
      this.baseSettingForm.markAllAsTouched();
      this.targetGroupForm.markAllAsTouched();
      this.settingDisplayOnPageForm.markAllAsTouched();
      this.settingDestinationForm.markAllAsTouched();

      return;
    }

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

    const groupCode = targetGroupList.find(
      (targetGroup) =>
        targetGroup.code === this.targetGroupForm.value.target_group_type
    )?.code;

    const tierList = this.tierSegmentIncludeExclude()
      .filter((item) => item.type === 'tier')
      .map((tier) => {
        return {
          id: tier.id,
          is_included: tier.isInclude,
        };
      });

    const segmentList = this.tierSegmentIncludeExclude()
      .filter((item) => item.type !== 'tier')
      .map((segment) => {
        return {
          id: segment.id,
          is_included: segment.isInclude,
        };
      });

    const bodyQueryParams: Partial<CreateEditBannerSettingQueryParams> = {
      banner_name: this.baseSettingForm.value.bannerName,
      start_date_time: startDate ? start_date_time.toISOString() : '',
      end_date_time: endDate ? end_date_time?.toISOString() : '',
      is_published: this.baseSettingForm.value.published,
      target_group_id: groupCode || 1,
      page_id: this.settingDisplayOnPageForm.value.pageId,
      destination_type: this.settingDestinationForm.value.destination_type,
      destination_value: this.settingDestinationForm.value.destination_value,
      tier_list: tierList,
      segment_list: segmentList,
    };

    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditBannerSettingActions.updateBannerSetting({
          data: {
            ...bodyQueryParams,
            banner_id: this.bannerSettingId(),
            display_order: this.bannerSettingDetail.display_order,
          },
          file: file.name ? file : null,
        })
      );
    } else {
      this.store.dispatch(
        CreateEditBannerSettingActions.createBannerSetting({
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
        CreateEditBannerSettingActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
    this.targetGroupForm.disable({ emitEvent: false });
    this.settingDisplayOnPageForm.disable({ emitEvent: false });
    this.settingDestinationForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
    this.targetGroupForm.enable({ emitEvent: false });
    this.settingDisplayOnPageForm.enable({ emitEvent: false });
    this.settingDestinationForm.enable({ emitEvent: false });
  }

  segmentTierListChange(items: TierSegmentIncludeExclude[]) {
    this.tierSegmentIncludeExclude.set(items);
    this.store.dispatch(
      CreateEditBannerSettingActions.setIncludeExcludeSegmentTier({ items })
    );

    this.store.dispatch(
      CreateEditBannerSettingActions.getTargetGroupUserSummary({
        target_group_id: this.targetGroupForm.value.target_group_type,
      })
    );

    this.store.dispatch(
      CreateEditBannerSettingActions.setFormDirty({
        isDirty: true,
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditBannerSettingActions.resetAll());
  }
}
