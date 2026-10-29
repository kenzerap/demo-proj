import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsLayoutComponent } from './notifications-layout.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter, UrlSegment } from '@angular/router';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import * as NotificationsActions from '../../stores/notification/notification.actions';
import { TimePeriodType } from '@app/shared/utils/enums/time-period-type.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NotificationsLayoutComponent', () => {
  let component: NotificationsLayoutComponent;
  let fixture: ComponentFixture<NotificationsLayoutComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;
  let activatedRoute: jest.Mocked<ActivatedRoute>;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    router = {
      navigate: jest.fn(),
      events: routerEvents$.asObservable(),
    } as unknown as jest.Mocked<Router>;

    activatedRoute = {
      firstChild: {
        snapshot: { url: [{ path: 'scheduled' }] },
        firstChild: null,
      },
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [NotificationsLayoutComponent],
      providers: [
        provideMockStore(),
        provideRouter([]),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsLayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize activeTabUrl on ngOnInit', () => {
    jest.spyOn(component, 'getActiveTabUrl');
    component.ngOnInit();
    expect(component.getActiveTabUrl).toHaveBeenCalled();
    expect(component.activeTabUrl()).toBe('scheduled');
  });

  it('should navigate to the correct tab on changeTab', () => {
    component.changeTab('trigger-event-based');
    expect(router.navigate).toHaveBeenCalledWith(['trigger-event-based'], {
      relativeTo: activatedRoute,
    });
    expect(component.targetGroupUserCountId()).toBe('');
  });

  it('should set activeTabUrl and dispatch actions in getActiveTabUrl', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.getActiveTabUrl();
    expect(component.activeTabUrl()).toBe('scheduled');
    expect(dispatchSpy).toHaveBeenCalledWith(
      NotificationsActions.getTargetGroupUserCount({
        sendTimeType: TimePeriodType.SPECIFIC_TIME,
      })
    );
  });

  it('should set targetGroupUserCountId and dispatch setNotificationFilters in selectTargetGroup', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const targetGroupUserCount = {
      id: '1',
      target_group_ids: [1, 2],
      name: 'Test',
      count: 10,
    };
    component.selectTargetGroup(targetGroupUserCount);
    expect(component.targetGroupUserCountId()).toBe('1');
    expect(dispatchSpy).toHaveBeenCalledWith(
      NotificationsActions.setNotificationFilters({
        filters: { target_group_ids: [1, 2], page: 0 },
      })
    );
  });

  it('should check equality of target group IDs in checkEqualTargetGroupIds', () => {
    expect(
      component.checkEqualTargetGroupIds([1, 2], [2, 1], '1')
    ).toBeTruthy();
    component.targetGroupUserCountId.set('1');
    expect(
      component.checkEqualTargetGroupIds([1, 2], [2, 1], '1')
    ).toBeTruthy();
    expect(component.checkEqualTargetGroupIds([1, 2], [2, 3], '1')).toBeFalsy();
  });

  it('should navigate to create form on openCreatePushNotificationDialog', () => {
    component.openCreatePushNotificationDialog();
    expect(router.navigate).toHaveBeenCalledWith(['form', 'create'], {
      relativeTo: activatedRoute,
    });
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(NotificationsActions.resetAll());
  });

  it('should update activeTabUrl on router NavigationEnd event', () => {
    jest.spyOn(component, 'getActiveTabUrl');
    routerEvents$.next(new NavigationEnd(1, '/scheduled', '/scheduled'));
    expect(component.getActiveTabUrl).toHaveBeenCalled();
  });

  it('should set activeTabUrl and dispatch correct action for "scheduled"', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.getActiveTabUrl();

    expect(component.activeTabUrl()).toBe('scheduled');
    expect(dispatchSpy).toHaveBeenCalledWith(
      NotificationsActions.getTargetGroupUserCount({
        sendTimeType: TimePeriodType.SPECIFIC_TIME,
      })
    );
  });

  it('should set activeTabUrl and dispatch correct action for "trigger-event-based"', () => {
    activatedRoute.firstChild!.snapshot.url = [
      { path: 'trigger-event-based' },
    ] as UrlSegment[];
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.getActiveTabUrl();

    expect(component.activeTabUrl()).toBe('trigger-event-based');
    expect(dispatchSpy).toHaveBeenCalledWith(
      NotificationsActions.getTargetGroupUserCount({
        sendTimeType: TimePeriodType.TRIGGER_EVENT,
      })
    );
  });

  it('should set activeTabUrl and dispatch correct action for "sent"', () => {
    activatedRoute.firstChild!.snapshot.url = [
      { path: 'sent' },
    ] as UrlSegment[];
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.getActiveTabUrl();

    expect(component.activeTabUrl()).toBe('sent');
    expect(dispatchSpy).toHaveBeenCalledWith(
      NotificationsActions.getTargetGroupUserCount({
        sendTimeType: TimePeriodType.IMMEDIATELY,
      })
    );
  });
});
