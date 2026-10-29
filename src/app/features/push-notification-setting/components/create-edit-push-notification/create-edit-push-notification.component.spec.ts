import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditPushNotificationComponent } from './create-edit-push-notification.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as CreateEditPushNotificationActions from '../../stores/create-edit-push-notification/create-edit-push-notification.actions';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { TriggerEventType } from '@app/shared/utils/enums/trigger-event-type.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateEditPushNotificationComponent', () => {
  let component: CreateEditPushNotificationComponent;
  let fixture: ComponentFixture<CreateEditPushNotificationComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    mockRouter = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;
    mockActivatedRoute = { params: of({ notification_id: '123' }) };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditPushNotificationComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCheckboxModule,
        MatFormFieldModule,
      ],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditPushNotificationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and fetch notification details on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPushNotificationActions.getNotificationDetail({
        notificationId: '123',
      })
    );
  });

  it('should handle segment tier list changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const items = [{ id: 1, isInclude: true, type: 'tier', name: 'Tier 1' }];
    component.segmentTierListChange(items);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPushNotificationActions.setIncludeExcludeSegmentTier({ items })
    );
  });

  it('should disable all forms', () => {
    component.disableAllForm();
    expect(component.sendTimeForm.disabled).toBeTruthy();
    expect(component.messagesForm.disabled).toBeTruthy();
  });

  it('should enable all forms', () => {
    component.enableAllForm();
    expect(component.sendTimeForm.enabled).toBeTruthy();
    expect(component.messagesForm.enabled).toBeTruthy();
  });

  it('should check platform error', () => {
    component.platformForm.patchValue({ android: false, ios: false });
    expect(component.checkPlatformError()).toBeTruthy();
  });

  it('should mark all forms as touched if validation fails on submit', () => {
    component.messagesForm.patchValue({
      message_title_thai: '',
      message_title_en: '',
    });
    component.onSubmit();
    expect(component.messagesForm.get('message_title_thai')?.touched).toBe(
      true
    );
  });

  it('should reset form dirty state on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPushNotificationActions.reset()
    );
  });

  it('should handle form mode changes', () => {
    component.setFormMode('view');
    expect(component.formMode()).toBe('view');
    expect(component.sendTimeForm.disabled).toBeTruthy();

    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    expect(component.sendTimeForm.enabled).toBeTruthy();
  });

  it('should handle trigger event type value for message', () => {
    component.sendTimeForm.patchValue({
      send_time_type: TimePeriodType.TRIGGER_EVENT,
    });
    component.triggerEventForm.patchValue({
      trigger_event_type: TriggerEventType.PaymentDueDate,
    });
    expect(component.getTriggerEventTypeValueForMessage()).toBe(
      TriggerEventType.PaymentDueDate
    );
  });

  it('should convert message body to HTML text', () => {
    const messageBody = 'Hello World {{user_name}}';
    const result = component.convertMessageBodyToHtmlText(messageBody);
    expect(result).toBe(
      'Hello World <span style="color: rgb(199, 43, 41); background-color: rgb(251, 234, 233);">User Name</span>'
    );
  });

  it('should dispatch createPushNotification action when formMode is "create"', () => {
    jest.spyOn(store, 'dispatch');
    component.formMode.set('create');

    // Set valid form values
    component.sendTimeForm.patchValue({
      send_time_type: 'IMMEDIATELY',
      start_date: '2023-12-01',
      start_time: '10:00',
    });
    component.platformForm.patchValue({ android: true, ios: true });
    component.messagesForm.patchValue({
      message_title_thai: 'Test Title TH',
      message_title_en: 'Test Title EN',
      message_body_thai: 'Test Body TH',
      message_body_en: 'Test Body EN',
    });
    component.settingDestinationForm.patchValue({
      destination_type: 'Privilege',
      destination_value: 'Test Destination',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditPushNotificationActions.createPushNotification({
          queryParams: {
            message_title_thai: 'Test Title TH',
            message_title_en: 'Test Title EN',
            message_body_thai: 'Test Body TH',
            message_body_en: 'Test Body EN',
            platform: 'IOS_ANDROID',
            send_time_type: 'IMMEDIATELY',
            destination_type: 'Privilege',
            destination_value: 'Test Destination',
          },
        })
      );
    }, 0);
  });

  it('should dispatch updatePushNotification action when formMode is "edit"', () => {
    jest.spyOn(store, 'dispatch');
    component.formMode.set('edit');
    component.notificationId.set('123');

    // Set valid form values
    component.sendTimeForm.patchValue({
      send_time_type: 'IMMEDIATELY',
      start_date: '2023-12-01',
      start_time: '10:00',
    });
    component.platformForm.patchValue({ android: true, ios: true });
    component.messagesForm.patchValue({
      message_title_thai: 'Test Title TH',
      message_title_en: 'Test Title EN',
      message_body_thai: 'Test Body TH',
      message_body_en: 'Test Body EN',
    });
    component.settingDestinationForm.patchValue({
      destination_type: 'Privilege',
      destination_value: 'Test Destination',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditPushNotificationActions.updatePushNotification({
          notificationId: '123',
          data: {
            message_title_thai: 'Test Title TH',
            message_title_en: 'Test Title EN',
            message_body_thai: 'Test Body TH',
            message_body_en: 'Test Body EN',
            platform: 'IOS_ANDROID',
            send_time_type: 'IMMEDIATELY',
            destination_type: 'Privilege',
            destination_value: 'Test Destination',
          },
        })
      );
    }, 0);
  });

  it('should mark all forms as touched and not dispatch any action if form is invalid', () => {
    jest.spyOn(store, 'dispatch');

    // Set invalid form values
    component.sendTimeForm.patchValue({
      send_time_type: '',
    });
    component.platformForm.patchValue({ android: false, ios: false });
    component.messagesForm.patchValue({
      message_title_thai: '',
      message_title_en: '',
      message_body_thai: '',
      message_body_en: '',
    });
    component.settingDestinationForm.patchValue({
      destination_type: '',
      destination_value: '',
    });

    component.onSubmit();

    expect(component.sendTimeForm.touched).toBeTruthy();
    expect(component.platformForm.touched).toBeTruthy();
    expect(component.messagesForm.touched).toBeTruthy();
    expect(component.settingDestinationForm.touched).toBeTruthy();

    setTimeout(() => {
      expect(store.dispatch).not.toHaveBeenCalled();
    }, 0);
  });

  it('should reset message fields when onChangeTriggerEventType is called in edit mode', () => {
    component.formMode.set('edit');
    component.messagesForm.patchValue({
      message_body_thai: 'test',
      message_body_thai_html_text: 'test',
      message_body_en: 'test',
      message_body_en_html_text: 'test',
    });

    component.onChangeTriggerEventType(TriggerEventType.PaymentDueDate);

    expect(component.messagesForm.get('message_body_thai')?.value).toBe('');
    expect(
      component.messagesForm.get('message_body_thai_html_text')?.value
    ).toBe('');
    expect(component.messagesForm.get('message_body_en')?.value).toBe('');
    expect(component.messagesForm.get('message_body_en_html_text')?.value).toBe(
      ''
    );
  });

  it('should not reset message fields when onChangeTriggerEventType is called in create mode', () => {
    component.formMode.set('create');
    component.messagesForm.patchValue({
      message_body_thai: 'test',
      message_body_thai_html_text: 'test',
      message_body_en: 'test',
      message_body_en_html_text: 'test',
    });

    component.onChangeTriggerEventType(TriggerEventType.PaymentDueDate);

    expect(component.messagesForm.get('message_body_thai')?.value).toBe('test');
    expect(
      component.messagesForm.get('message_body_thai_html_text')?.value
    ).toBe('test');
    expect(component.messagesForm.get('message_body_en')?.value).toBe('test');
    expect(component.messagesForm.get('message_body_en_html_text')?.value).toBe(
      'test'
    );
  });
});
