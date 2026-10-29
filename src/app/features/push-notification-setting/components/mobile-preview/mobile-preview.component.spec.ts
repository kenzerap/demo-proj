import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobilePreviewComponent } from './mobile-preview.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as CreateEditPushNotificationActions from '../../stores/create-edit-push-notification/create-edit-push-notification.actions';
import * as createEditPushNotificationSelectors from '../../stores/create-edit-push-notification/create-edit-push-notification.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MobilePreviewComponent', () => {
  let component: MobilePreviewComponent;
  let fixture: ComponentFixture<MobilePreviewComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePreviewComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobilePreviewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Mock selectors
    store.overrideSelector(
      createEditPushNotificationSelectors.selectPreviewMessage,
      { title: 'Test Title', body: 'Test Body' }
    );
    store.overrideSelector(
      createEditPushNotificationSelectors.selectTargetGroupUserSummary,
      { percentage: 50, count: 100, name: 'Test Group', target_group_id: [1] }
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getTargetGroupUserSummary when targetGroupId is set', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.targetGroupId = 123;
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditPushNotificationActions.getTargetGroupUserSummary({
        target_group_id: 123,
      })
    );
  });

  it('should return the correct targetGroupId', () => {
    component.targetGroupId = 456;
    expect(component.targetGroupId).toBe(456);
  });

  it('should select previewMessage from the store', (done) => {
    component.previewMessage$.subscribe((message) => {
      expect(message).toEqual({ title: 'Test Title', body: 'Test Body' });
      done();
    });
  });

  it('should select targetGroupUserSummary from the store', (done) => {
    component.targetGroupUserSummary$.subscribe((summary) => {
      expect(summary).toEqual({
        percentage: 50,
        count: 100,
        name: 'Test Group',
        target_group_id: [1],
      });
      done();
    });
  });
});
