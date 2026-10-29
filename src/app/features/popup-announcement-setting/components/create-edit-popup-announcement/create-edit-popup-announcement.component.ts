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
import { MobileAnnouncementPreviewComponent } from '../mobile-announcement-preview/mobile-announcement-preview.component';
import { BaseSettingSectionComponent } from '../base-setting-section/base-setting-section.component';
import { TargetGroupSectionComponent } from '@app/shared/components/target-group-section/target-group-section.component';
import { SettingDisplayOnPageSectionComponent } from '../setting-display-on-page-section/setting-display-on-page-section.component';
import { SettingFrequencySectionComponent } from '../setting-frequency-section/setting-frequency-section.component';
import { AnnouncementSettingDestinationSectionComponent } from '../announcement-setting-destination-section/announcement-setting-destination-section.component';
import { CreateEditPopupAnnouncementQueryParams } from '../../models/create-edit-popup-announcement-query-params.model';
import * as CreateEditPopupAnnouncementActions from '@app/features/popup-announcement-setting/stores/create-edit-popup-announcement/create-edit-popup-announcement.actions';
import * as CreateEditPopupAnnouncementSelectors from '@app/features/popup-announcement-setting/stores/create-edit-popup-announcement/create-edit-popup-announcement.selectors';
import { PreviewImage } from '../../models/preview-image.model';
import { PopupAnnouncementDetail } from '../../models/popup-announcement-model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';

@Component({
  selector: 'app-create-edit-popup-announcement',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BaseSettingSectionComponent,
    ReactiveFormsModule,
    MatCheckboxModule,
    TargetGroupSectionComponent,
    MatFormFieldModule,
    MobileAnnouncementPreviewComponent,
    SettingDisplayOnPageSectionComponent,
    SettingFrequencySectionComponent,
    AnnouncementSettingDestinationSectionComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-popup-announcement.component.html',
  styleUrls: ['./create-edit-popup-announcement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditPopupAnnouncementComponent
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

  createLoading$ = this.store.select(
    selectIsLoading(`createPopupAnnouncement`)
  );
  updateLoading$ = this.store.select(
    selectIsLoading(`updatePopupAnnouncement`)
  );
  previewImages$: Observable<PreviewImage[]> = this.store.select(
    CreateEditPopupAnnouncementSelectors.selectPreviewImages
  );
  tierGroups$: Observable<TierGroup[]> = this.store.select(
    CreateEditPopupAnnouncementSelectors.selectTierGroups
  );
  segmentGroups$: Observable<SegmentGroup[]> = this.store.select(
    CreateEditPopupAnnouncementSelectors.selectSegmentGroups
  );

  popupAnnouncementDetail$: Observable<PopupAnnouncementDetail | null> =
    this.store.select(
      CreateEditPopupAnnouncementSelectors.selectPopupAnnouncementDetail
    );

  targetGroups: WritableSignal<TargetGroup[]> = signal([]);
  triggerEventType = TriggerEventType;
  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  popupAnnouncementId: WritableSignal<number> = signal(0);
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
    dontShowButton: [false],
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

  settingFrequencyForm: FormGroup = this.fb.group({
    frequencyCap: ['', Validators.min(1)],
    frequencyPeriod: [''],
  });

  settingDestinationForm: FormGroup = this.fb.group({
    destination_type: [DestinationCode.Privilege, Validators.required],
    destination_value: ['', Validators.required],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['popupAnnouncementId']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.popupAnnouncementId.set(params['popupAnnouncementId']);
        this.setFormMode('view');
        this.disableAllForm();

        this.store.dispatch(
          CreateEditPopupAnnouncementActions.getPopupAnnouncementDetail({
            id: this.popupAnnouncementId(),
          })
        );
      });

    this.popupAnnouncementDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((popupAnnouncementDetail) => !!popupAnnouncementDetail)
      )
      .subscribe((popupAnnouncementDetail: PopupAnnouncementDetail) => {
        this.baseSettingForm.patchValue({
          send_time_type: popupAnnouncementDetail.publish_type,
          start_date: popupAnnouncementDetail.start_date_time,
          start_time: this.datePipe.transform(
            popupAnnouncementDetail.start_date_time,
            'HH:mm'
          ),
          published: popupAnnouncementDetail.is_published,
          isSetEndDate: !!popupAnnouncementDetail.end_date_time,
          end_date: popupAnnouncementDetail.end_date_time,
          end_time: this.datePipe.transform(
            popupAnnouncementDetail.end_date_time,
            'HH:mm'
          ),
          bannerName: popupAnnouncementDetail.banner_name,
          dontShowButton: popupAnnouncementDetail.dont_show_button,
        });

        this.baseSettingForm.patchValue({
          imageUrl: popupAnnouncementDetail.image_data,
          imageName: popupAnnouncementDetail.image,
          imageFile: popupAnnouncementDetail.image_data,
        });

        const target_group_id =
          popupAnnouncementDetail.target_group_id > 3
            ? 4
            : popupAnnouncementDetail.target_group_id;
        if (target_group_id === 4) {
          const items: TierSegmentIncludeExclude[] = [
            ...popupAnnouncementDetail.segment_list.map((segment) => {
              return {
                id: segment.id,
                type: 'segmentation',
                isInclude: segment.is_included,
                name: segment.name,
              };
            }),
            ...popupAnnouncementDetail.tier_list.map((tier) => {
              return {
                id: tier.id,
                type: 'tier',
                isInclude: tier.is_included,
                name: tier.name,
              };
            }),
          ];

          this.store.dispatch(
            CreateEditPopupAnnouncementActions.setIncludeExcludeSegmentTier({
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
          pageId: popupAnnouncementDetail.page_id.toString(),
        });

        this.settingFrequencyForm.patchValue({
          frequencyCap: popupAnnouncementDetail.frequency_cap,
          frequencyPeriod: popupAnnouncementDetail.frequency_period,
        });

        this.settingDestinationForm.patchValue({
          destination_type: popupAnnouncementDetail.destination_type,
          destination_value: popupAnnouncementDetail.destination_value,
        });

        this.baseSettingForm.markAsPristine();
        this.targetGroupForm.markAsPristine();
        this.settingDisplayOnPageForm.markAsPristine();
        this.settingFrequencyForm.markAsPristine();
        this.settingDestinationForm.markAsPristine();

        setTimeout(() => {
          this.store.dispatch(
            CreateEditPopupAnnouncementActions.setFormDirty({
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
      CreateEditPopupAnnouncementActions.getTierGroups({
        page: 0,
        size: 999,
      })
    );

    this.store.dispatch(
      CreateEditPopupAnnouncementActions.getSegmentGroups({
        page: 0,
        size: 999,
      })
    );

    merge(
      this.baseSettingForm.valueChanges,
      this.targetGroupForm.valueChanges,
      this.settingDisplayOnPageForm.valueChanges,
      this.settingFrequencyForm.valueChanges,
      this.settingDestinationForm.valueChanges
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditPopupAnnouncementActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditPopupAnnouncementActions.createPopupAnnouncementSuccess,
          CreateEditPopupAnnouncementActions.updatePopupAnnouncementSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditPopupAnnouncementActions.setFormDirty({ isDirty: false })
        );

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The popup announcement was created`
                : 'The popup announcement was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'application-management',
            'popup-announcement-setting',
            'list',
          ]);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    this.baseSettingForm.get('start_time')?.updateValueAndValidity();

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
      this.settingFrequencyForm.valid &&
      this.settingDestinationForm.valid;

    if (!isValidForm) {
      this.baseSettingForm.markAllAsTouched();
      this.targetGroupForm.markAllAsTouched();
      this.settingDisplayOnPageForm.markAllAsTouched();
      this.settingFrequencyForm.markAllAsTouched();
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

    const bodyQueryParams: Partial<CreateEditPopupAnnouncementQueryParams> = {
      bannerName: this.baseSettingForm.value.bannerName,
      dontShowButton: this.baseSettingForm.value.dontShowButton,
      startDateTime: startDate ? start_date_time.toISOString() : '',
      endDateTime: endDate ? end_date_time?.toISOString() : '',
      publishType: this.baseSettingForm.value.send_time_type,
      isPublished: this.baseSettingForm.value.published,
      targetGroupId: groupCode || 1,
      pageId: this.settingDisplayOnPageForm.value.pageId,
      frequencyCap: this.settingFrequencyForm.value.frequencyCap,
      frequencyPeriod: this.settingFrequencyForm.value.frequencyPeriod,
      destinationType: this.settingDestinationForm.value.destination_type,
      destinationValue: this.settingDestinationForm.value.destination_value,
      tierList,
      segmentList,
    };

    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditPopupAnnouncementActions.updatePopupAnnouncement({
          data: { ...bodyQueryParams, id: this.popupAnnouncementId() },
          file: file.name ? file : null,
        })
      );
    } else {
      this.store.dispatch(
        CreateEditPopupAnnouncementActions.createPopupAnnouncement({
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
        CreateEditPopupAnnouncementActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.baseSettingForm.disable({ emitEvent: false });
    this.targetGroupForm.disable({ emitEvent: false });
    this.settingDisplayOnPageForm.disable({ emitEvent: false });
    this.settingFrequencyForm.disable({ emitEvent: false });
    this.settingDestinationForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.baseSettingForm.enable({ emitEvent: false });
    this.targetGroupForm.enable({ emitEvent: false });
    this.settingDisplayOnPageForm.enable({ emitEvent: false });
    this.settingFrequencyForm.enable({ emitEvent: false });
    this.settingDestinationForm.enable({ emitEvent: false });
  }

  segmentTierListChange(items: TierSegmentIncludeExclude[]) {
    this.tierSegmentIncludeExclude.set(items);
    this.store.dispatch(
      CreateEditPopupAnnouncementActions.setIncludeExcludeSegmentTier({ items })
    );

    this.store.dispatch(
      CreateEditPopupAnnouncementActions.getTargetGroupUserSummary({
        target_group_id: this.targetGroupForm.value.target_group_type,
      })
    );

    this.store.dispatch(
      CreateEditPopupAnnouncementActions.setFormDirty({
        isDirty: true,
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditPopupAnnouncementActions.resetAll());
  }
}
