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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { filter, map, merge, Observable, takeUntil } from 'rxjs';
import { SendTimeSectionComponent } from '../send-time-section/send-time-section.component';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TriggerEventSectionComponent } from '../trigger-event-section/trigger-event-section.component';
import { TriggerEventType } from '@app/shared/utils/enums/trigger-event-type.enum';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { SettingDestinationSectionComponent } from '../setting-destination-section/setting-destination-section.component';
import { DestinationCode } from '../../../../shared/constants/destination-options.const';
import { MessagesSectionComponent } from '../messages-section/messages-section.component';
import { TargetGroupType } from '../../../../shared/components/target-group-section/target-group-type.enum';
import { MobilePreviewComponent } from '../mobile-preview/mobile-preview.component';
import { CreateEditNotificationsQueryParams } from '../../models/create-edit-notifications-query-params.model';
import * as CreateEditPushNotificationActions from '../../stores/create-edit-push-notification/create-edit-push-notification.actions';
import * as createEditPushNotificationSelectors from '../../stores/create-edit-push-notification/create-edit-push-notification.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { TargetGroup } from '../../../../shared/models/target-group.model';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { targetGroupList } from '../../../../shared/constants/target-group-list.const';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationDetail } from '../../models/notification.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { noSpacesValidator } from '@app/shared/utils/no-spaces-validator';
import { messageVariables } from '../../constants/message-variables';
import { TargetGroupSectionComponent } from '@app/shared/components/target-group-section/target-group-section.component';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';

@Component({
  selector: 'app-create-edit-push-notification',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    SendTimeSectionComponent,
    ReactiveFormsModule,
    MatCheckboxModule,
    TargetGroupSectionComponent,
    TriggerEventSectionComponent,
    SettingDestinationSectionComponent,
    MessagesSectionComponent,
    MobilePreviewComponent,
    MatFormFieldModule,
  ],
  providers: [DatePipe],
  templateUrl: './create-edit-push-notification.component.html',
  styleUrl: './create-edit-push-notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditPushNotificationComponent
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

  loading$ = this.store.select(selectIsLoading(`createNotifications`));
  notificationDetail$: Observable<NotificationDetail | null> =
    this.store.select(
      createEditPushNotificationSelectors.selectNotificationDetail
    );
  tierGroups$: Observable<TierGroup[]> = this.store.select(
    createEditPushNotificationSelectors.selectTierGroups
  );
  segmentGroups$: Observable<SegmentGroup[]> = this.store.select(
    createEditPushNotificationSelectors.selectSegmentGroups
  );

  targetGroups: WritableSignal<TargetGroup[]> = signal([]);
  pushNotificationType = TimePeriodType;
  triggerEventType = TriggerEventType;
  formMode: WritableSignal<'create' | 'edit' | 'view'> = signal('create');
  notificationId: WritableSignal<string> = signal('');
  tierSegmentIncludeExclude: WritableSignal<TierSegmentIncludeExclude[]> =
    signal([]);

  sendTimeForm: FormGroup = this.fb.group({
    send_time_type: [TimePeriodType.IMMEDIATELY, Validators.required],
    start_date: [''],
    start_time: [''],
    published: [false],
    isSetEndDate: [false],
    end_date: [''],
    end_time: [''],
  });

  platformForm: FormGroup = this.fb.group({
    android: [true, Validators.required],
    ios: [true, Validators.required],
  });

  messageBoxControl = new FormControl<boolean>(false);

  targetGroupForm: FormGroup = this.fb.group({
    target_group_type: [TargetGroupType.ALL, Validators.required],
    target_group_id: [''],
  });

  triggerEventForm: FormGroup = this.fb.group({
    trigger_event_type: [TriggerEventType.PaymentDueDate, Validators.required],
    trigger_event_condition: [CompareConditionType.Is, Validators.required],
    trigger_event_value: [
      { value: 'Today', disabled: true },
      Validators.required,
    ],
    trigger_event_unit: [{ value: '-', disabled: true }, Validators.required],
  });

  settingDestinationForm: FormGroup = this.fb.group({
    destination_type: [DestinationCode.Privilege, Validators.required],
    destination_value: ['', [Validators.required]],
  });

  messagesForm: FormGroup = this.fb.group({
    message_title_thai: ['', [Validators.required, noSpacesValidator]],
    message_title_en: ['', [Validators.required, noSpacesValidator]],
    message_body_thai: ['', Validators.required],
    message_body_thai_html_text: [''],
    message_body_en: ['', Validators.required],
    message_body_en_html_text: [''],
  });

  /* istanbul ignore next */
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => !!params['notification_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.notificationId.set(params['notification_id']);
        this.setFormMode('view');
        this.disableAllForm();

        this.store.dispatch(
          CreateEditPushNotificationActions.getNotificationDetail({
            notificationId: this.notificationId(),
          })
        );
      });

    this.notificationDetail$
      .pipe(
        takeUntil(this.destroy$),
        filter((notificationDetail) => !!notificationDetail)
      )
      .subscribe((notificationDetail: NotificationDetail) => {
        this.sendTimeForm.patchValue({
          send_time_type: notificationDetail?.send_time_type,
          start_date: notificationDetail?.start_date_time,
          start_time: this.datePipe.transform(
            notificationDetail?.start_date_time,
            'HH:mm'
          ),
          published: notificationDetail?.published,
          isSetEndDate: !!notificationDetail?.end_date_time,
          end_date: notificationDetail?.end_date_time,
          end_time: this.datePipe.transform(
            notificationDetail?.end_date_time,
            'HH:mm'
          ),
        });

        this.platformForm.patchValue({
          android:
            notificationDetail?.platform === 'ANDROID' ||
            notificationDetail?.platform === 'IOS_ANDROID',
          ios:
            notificationDetail?.platform === 'IOS' ||
            notificationDetail?.platform === 'IOS_ANDROID',
        });

        this.messageBoxControl.patchValue(
          notificationDetail?.shown_in_message_box
        );

        const target_group_id =
          notificationDetail.target_group_id > 3
            ? 4
            : notificationDetail.target_group_id;
        if (target_group_id === 4) {
          const items: TierSegmentIncludeExclude[] = [
            ...notificationDetail.segment_list.map((segment) => {
              return {
                id: segment.id,
                type: 'segmentation',
                isInclude: segment.is_included,
                name: segment.name,
              };
            }),
            ...notificationDetail.tier_list.map((tier) => {
              return {
                id: tier.id,
                type: 'tier',
                isInclude: tier.is_included,
                name: tier.name,
              };
            }),
          ];

          this.store.dispatch(
            CreateEditPushNotificationActions.setIncludeExcludeSegmentTier({
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

        this.triggerEventForm.patchValue({
          trigger_event_type: notificationDetail?.trigger_event_type,
          trigger_event_condition: notificationDetail?.trigger_event_condition,
          trigger_event_value: notificationDetail?.trigger_event_value,
          trigger_event_unit: notificationDetail?.trigger_event_unit,
        });

        this.settingDestinationForm.patchValue({
          destination_type: notificationDetail?.destination_type,
          destination_value: notificationDetail?.destination_value,
        });

        this.messagesForm.patchValue({
          message_title_thai: notificationDetail?.message_title_thai,
          message_title_en: notificationDetail?.message_title_en,
          message_body_thai: notificationDetail?.message_body_thai,
          message_body_thai_html_text: this.convertMessageBodyToHtmlText(
            notificationDetail?.message_body_thai
          ),
          message_body_en: notificationDetail?.message_body_en,
          message_body_en_html_text: this.convertMessageBodyToHtmlText(
            notificationDetail?.message_body_en
          ),
        });

        this.sendTimeForm.markAsPristine();
        this.platformForm.markAsPristine();
        this.messageBoxControl.markAsPristine();
        this.targetGroupForm.markAsPristine();
        this.triggerEventForm.markAsPristine();
        this.settingDestinationForm.markAsPristine();
        this.messagesForm.markAsPristine();

        setTimeout(() => {
          this.store.dispatch(
            CreateEditPushNotificationActions.setFormDirty({ isDirty: false })
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
    const groupId =
      this.targetGroupForm.get('target_group_id')?.getRawValue() || 1;
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
      CreateEditPushNotificationActions.getTierGroups({
        page: 0,
        size: 999,
      })
    );

    this.store.dispatch(
      CreateEditPushNotificationActions.getSegmentGroups({
        page: 0,
        size: 999,
      })
    );

    merge(
      this.sendTimeForm.valueChanges,
      this.platformForm.valueChanges,
      this.messageBoxControl.valueChanges,
      this.targetGroupForm.valueChanges,
      this.triggerEventForm.valueChanges,
      this.settingDestinationForm.valueChanges,
      this.messagesForm.valueChanges
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode() !== 'view')
      )
      .subscribe((value) => {
        this.store.dispatch(
          CreateEditPushNotificationActions.setFormDirty({ isDirty: true })
        );
      });

    this.actions$
      .pipe(
        ofType(
          CreateEditPushNotificationActions.createPushNotificationSuccess,
          CreateEditPushNotificationActions.updatePushNotificationSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(
          CreateEditPushNotificationActions.setFormDirty({ isDirty: false })
        );

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message:
              this.formMode() === 'create'
                ? `The push notification was created`
                : 'The push notification was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([
            'application-management',
            'push-notification-setting',
          ]);
        });
      });
  }

  /* istanbul ignore next */
  onSubmit() {
    this.sendTimeForm.get('start_time')?.updateValueAndValidity();

    const isTriggerEvent =
      this.sendTimeForm.get('send_time_type')?.getRawValue() ===
      TimePeriodType.TRIGGER_EVENT;

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
      this.sendTimeForm.valid &&
      !this.checkPlatformError() &&
      isValidTargetGroupForm &&
      this.settingDestinationForm.valid &&
      this.messagesForm.valid &&
      (!isTriggerEvent || this.triggerEventForm.valid);

    if (!isValidForm) {
      this.sendTimeForm.markAllAsTouched();
      this.platformForm.markAllAsTouched();
      this.messageBoxControl.markAllAsTouched();
      this.targetGroupForm.markAllAsTouched();
      this.triggerEventForm.markAllAsTouched();
      this.settingDestinationForm.markAllAsTouched();
      this.messagesForm.markAllAsTouched();

      return;
    }

    const startTime = this.sendTimeForm.getRawValue().start_time;
    const endTime = this.sendTimeForm.getRawValue().end_time;
    const startDate = this.sendTimeForm.getRawValue().start_date;
    const endDate = this.sendTimeForm.getRawValue().end_date;

    const [startHours, startMinutes] = (startTime || '').split(':').map(Number);
    const start_date_time = new Date(startDate);
    start_date_time.setHours(startHours, startMinutes, 0, 0);

    const [endHours, endMinutes] = (endTime || '').split(':').map(Number);
    const end_date_time = endDate ? new Date(endDate) : null;
    end_date_time?.setHours(endHours, endMinutes, 0, 0);

    const groupCode = targetGroupList.find(
      (targetGroup) =>
        targetGroup.code ===
        this.targetGroupForm.getRawValue().target_group_type
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

    const isSelectTriggerEvent =
      this.sendTimeForm.getRawValue().send_time_type ===
      TimePeriodType.TRIGGER_EVENT;

    const bodyQueryParams: Partial<CreateEditNotificationsQueryParams> = {
      message_title_thai: this.messagesForm.getRawValue().message_title_thai,
      message_title_en: this.messagesForm.getRawValue().message_title_en,
      message_body_thai: this.messagesForm.getRawValue().message_body_thai,
      message_body_en: this.messagesForm.getRawValue().message_body_en,

      platform:
        !!this.platformForm.getRawValue().android &&
        !!this.platformForm.getRawValue().ios
          ? 'IOS_ANDROID'
          : !!this.platformForm.getRawValue().android
          ? 'ANDROID'
          : 'IOS',
      shown_in_message_box: !!this.messageBoxControl.getRawValue(),

      send_time_type: this.sendTimeForm.getRawValue().send_time_type,
      published: this.sendTimeForm.getRawValue().published,
      start_date_time: startDate ? start_date_time.toISOString() : '',
      end_date_time: endDate ? end_date_time?.toISOString() : '',

      target_group_id: groupCode || 1,
      target_group_tiers: {},

      trigger_event_type: isSelectTriggerEvent
        ? this.triggerEventForm.getRawValue().trigger_event_type
        : null,
      trigger_event_condition: isSelectTriggerEvent
        ? this.triggerEventForm.getRawValue().trigger_event_condition
        : null,
      trigger_event_value: isSelectTriggerEvent
        ? this.triggerEventForm.getRawValue().trigger_event_value
        : null,
      trigger_event_unit: isSelectTriggerEvent
        ? this.triggerEventForm.getRawValue().trigger_event_unit
        : null,

      destination_type:
        this.settingDestinationForm.getRawValue().destination_type,
      destination_value:
        this.settingDestinationForm.getRawValue().destination_value,
      tier_list: tierList,
      segment_list: segmentList,
    };

    if (this.formMode() === 'edit') {
      this.store.dispatch(
        CreateEditPushNotificationActions.updatePushNotification({
          notificationId: this.notificationId(),
          data: bodyQueryParams,
        })
      );
    } else {
      this.store.dispatch(
        CreateEditPushNotificationActions.createPushNotification({
          queryParams: bodyQueryParams,
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
        CreateEditPushNotificationActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  }

  disableAllForm() {
    this.sendTimeForm.disable({ emitEvent: false });
    this.platformForm.disable({ emitEvent: false });
    this.messageBoxControl.disable({ emitEvent: false });
    this.targetGroupForm.disable({ emitEvent: false });
    this.triggerEventForm.disable({ emitEvent: false });
    this.settingDestinationForm.disable({ emitEvent: false });
    this.messagesForm.disable({ emitEvent: false });
  }

  enableAllForm() {
    this.sendTimeForm.enable({ emitEvent: false });
    this.platformForm.enable({ emitEvent: false });
    this.messageBoxControl.enable({ emitEvent: false });
    this.targetGroupForm.enable({ emitEvent: false });
    this.triggerEventForm.enable({ emitEvent: false });
    this.settingDestinationForm.enable({ emitEvent: false });
    this.messagesForm.enable({ emitEvent: false });

    this.sendTimeForm.get('send_time_type')?.disable({ emitEvent: false });

    if (
      this.triggerEventForm.get('trigger_event_condition')?.getRawValue() ===
      CompareConditionType.Is
    ) {
      this.triggerEventForm
        .get('trigger_event_value')
        ?.disable({ emitEvent: false });
    }

    this.triggerEventForm
      .get('trigger_event_unit')
      ?.disable({ emitEvent: false });
  }

  getTriggerEventTypeValueForMessage(): TriggerEventType | null {
    return this.sendTimeForm.get('send_time_type')?.getRawValue() ===
      TimePeriodType.TRIGGER_EVENT
      ? this.triggerEventForm.get('trigger_event_type')?.getRawValue()
      : null;
  }

  checkPlatformError(): boolean {
    return (
      !this.platformForm.get('android')?.getRawValue() &&
      !this.platformForm.get('ios')?.getRawValue()
    );
  }

  convertMessageBodyToHtmlText(messageBody: string): string {
    const existedVariables = messageVariables.filter((variable) =>
      messageBody.includes(variable.code)
    );

    existedVariables.forEach((existedVariable) => {
      messageBody = messageBody
        .split(existedVariable.code)
        .join(
          `<span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">${existedVariable.value}</span>`
        );
    });
    return messageBody;
  }

  onChangeTriggerEventType(_eventType: TriggerEventType) {
    if (this.formMode() === 'edit') {
      this.messagesForm.get('message_body_thai')?.reset('');
      this.messagesForm.get('message_body_thai_html_text')?.reset('');
      this.messagesForm.get('message_body_en')?.reset('');
      this.messagesForm.get('message_body_en_html_text')?.reset('');
    }
  }

  segmentTierListChange(items: TierSegmentIncludeExclude[]) {
    this.tierSegmentIncludeExclude.set(items);
    this.store.dispatch(
      CreateEditPushNotificationActions.setIncludeExcludeSegmentTier({ items })
    );

    this.store.dispatch(
      CreateEditPushNotificationActions.getTargetGroupUserSummary({
        target_group_id: this.targetGroupForm.value.target_group_type,
      })
    );

    this.store.dispatch(
      CreateEditPushNotificationActions.setFormDirty({
        isDirty: true,
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(CreateEditPushNotificationActions.reset());
  }
}
