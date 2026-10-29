import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduledListComponent } from './scheduled-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import * as NotificationsActions from '../../stores/notification/notification.actions';
import * as notificationsSelectors from '../../stores/notification/notification.selectors';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ScheduledListComponent', () => {
  let component: ScheduledListComponent;
  let fixture: ComponentFixture<ScheduledListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ScheduledListComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: notificationsSelectors.selectNotifications,
              value: of([]),
            },
            {
              selector: notificationsSelectors.selectPagination,
              value: of({ page: 0, size: 20, totalItems: 0, totalPages: 0 }),
            },
            {
              selector: notificationsSelectors.selectTargetGroupUserCounts,
              value: of([{ target_group_ids: [1, 2] }]),
            },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduledListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    component.hasEditPermission = true;
    store.overrideSelector(selectIsLoading('getNotifications'), false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setNotificationFilters on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        NotificationsActions.setNotificationFilters({
          filters: {
            page: 0,
            size: 20,
            isSent: true,
            sendTimeType: TimePeriodType.SPECIFIC_TIME,
            target_group_ids: [1, 2],
          },
        })
      );
    }, 0);
  });

  it('should dispatch setNotificationFilters with page on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      NotificationsActions.setNotificationFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setNotificationFilters with size and reset page on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(50);
    expect(dispatchSpy).toHaveBeenCalledWith(
      NotificationsActions.setNotificationFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should navigate to the correct route on onRowClick', () => {
    const notification = { id: '123' } as any;
    component.onRowClick(notification);
    expect(router.navigate).toHaveBeenCalledWith([
      'application-management',
      'push-notification-setting',
      'form',
      '123',
      'view-edit',
    ]);
  });

  it('should dispatch resetNotifications on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      NotificationsActions.resetNotifications()
    );
  });
});
