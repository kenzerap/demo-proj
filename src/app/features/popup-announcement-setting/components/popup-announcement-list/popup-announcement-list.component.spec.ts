import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupAnnouncementListComponent } from './popup-announcement-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import * as PopupAnnouncementActions from '../../stores/popup-announcement/popup-announcement.actions';
import * as PopupAnnouncementOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as popupAnnouncementSelectors from '../../stores/popup-announcement/popup-announcement.selectors';
import * as PopupAnnouncementOrderSelectors from '../../stores/reorder-list/reorder-list.selectors';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
import {
  PopupAnnouncementTable,
  PopupAnnouncement,
} from '../../models/popup-announcement-model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { DatePipe } from '@angular/common';

describe('PopupAnnouncementListComponent', () => {
  let component: PopupAnnouncementListComponent;
  let fixture: ComponentFixture<PopupAnnouncementListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;
  let activatedRoute: ActivatedRoute;
  let hasPermissionService: jest.Mocked<HasPermissionService>;
  let paramsSubject: BehaviorSubject<any>;

  const mockPopupAnnouncement: PopupAnnouncementTable = {
    bannerId: 1,
    bannerName: 'Test Banner',
    image: 'test-image.jpg',
    imageData: 'data:image/jpeg;base64,test',
    bannerType: 'popup',
    description: 'Test Description',
    displayOrder: 1,
    targetGroupId: 1,
    targetGroupName: 'Test Group',
    isPublished: true,
    publishType: 'scheduled',
    dontShowButton: false,
    destinationType: 'url',
    destinationValue: 'https://example.com',
    frequencyCap: 1,
    frequencyPeriod: 'day',
    createdBy: 'admin',
    updatedBy: 'admin',
    createdDate: '2023-01-01',
    updatedDate: '2023-01-01',
    pageId: 1,
    pageName: 'Home',
    startDateTime: '2023-01-01T00:00:00Z',
    endDateTime: '2023-12-31T23:59:59Z',
    pagePosition: 1,
    dragDisabled: false,
  };

  const mockTargetGroupUserCount = [
    { target_group_ids: [1], name: 'Group 1' },
    { target_group_ids: [2], name: 'Group 2' },
  ] as any;

  const mockPagination = {
    page: 0,
    size: 10,
    totalItems: 1,
    totalPages: 1,
  };

  beforeEach(async () => {
    paramsSubject = new BehaviorSubject({ tabId: '1' });

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    activatedRoute = {
      params: paramsSubject.asObservable(),
    } as unknown as ActivatedRoute;

    hasPermissionService = {
      hasPermission: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<HasPermissionService>;

    const initialState = {
      popupAnnouncement: {
        popupAnnouncements: [mockPopupAnnouncement],
        targetGroupUserCounts: mockTargetGroupUserCount,
        pagination: mockPagination,
        filters: { targetGroupIds: [1] },
      },
      reorderList: {
        isEditOrderMode: false,
        virtualPopupAnnouncements: [mockPopupAnnouncement],
      },
      loading: {
        getPopupAnnouncements: false,
        getMissingPopupAnnouncements: false,
      },
    };

    await TestBed.configureTestingModule({
      imports: [PopupAnnouncementListComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: HasPermissionService, useValue: hasPermissionService },
        DatePipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupAnnouncementListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Setup store selectors
    store.overrideSelector(
      popupAnnouncementSelectors.selectPopupAnnouncements,
      [mockPopupAnnouncement]
    );
    store.overrideSelector(
      popupAnnouncementSelectors.selectTargetGroupUserCounts,
      mockTargetGroupUserCount
    );
    store.overrideSelector(
      popupAnnouncementSelectors.selectPagination,
      mockPagination
    );
    store.overrideSelector(
      popupAnnouncementSelectors.selectselectedTargetGroupIds,
      [1]
    );
    store.overrideSelector(
      PopupAnnouncementOrderSelectors.selectIsEditOrderMode,
      false
    );
    store.overrideSelector(
      PopupAnnouncementOrderSelectors.selectVirtualPopupAnnouncements,
      [mockPopupAnnouncement]
    );
    store.overrideSelector(selectIsLoading('getPopupAnnouncements'), false);
    store.overrideSelector(
      selectIsLoading('getMissingPopupAnnouncements'),
      false
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.tableColumns()).toEqual(expect.any(Array));
      expect(component.partyId()).toBe('');
      expect(component.isEditOrderMode()).toBe(false);
    });

    it('should have edit permission when service returns true', () => {
      expect(component.hasEditPermission).toBe(true);
      expect(hasPermissionService.hasPermission).toHaveBeenCalled();
    });

    it('should not have edit permission when service returns false', async () => {
      hasPermissionService.hasPermission.mockReturnValue(false);

      await TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [PopupAnnouncementListComponent],
          providers: [
            provideMockStore(),
            { provide: Router, useValue: router },
            { provide: ActivatedRoute, useValue: activatedRoute },
            { provide: HasPermissionService, useValue: hasPermissionService },
            DatePipe,
          ],
          schemas: [NO_ERRORS_SCHEMA],
        })
        .compileComponents();

      const newFixture = TestBed.createComponent(
        PopupAnnouncementListComponent
      );
      const newComponent = newFixture.componentInstance;

      expect(newComponent.hasEditPermission).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch actions on init with default tabId', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should dispatch actions with custom tabId from params', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      paramsSubject.next({ tabId: '3' });

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should subscribe to isEditOrderMode changes', () => {
      store.overrideSelector(
        PopupAnnouncementOrderSelectors.selectIsEditOrderMode,
        true
      );
      store.refreshState();

      component.ngOnInit();

      expect(component.isEditOrderMode()).toBe(true);
    });

    it('should handle params without tabId', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      paramsSubject.next({});

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.getTargetGroupUserCount({
          pageId: 1,
          page: 0,
        })
      );
    });
  });

  describe('Observable Data Streams', () => {
    it('should map popup announcements with target group names correctly', (done) => {
      const testAnnouncement = {
        ...mockPopupAnnouncement,
        targetGroupId: 1,
      };

      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncements,
        [testAnnouncement]
      );
      store.refreshState();

      component.popupAnnouncements$.subscribe((announcements) => {
        expect(announcements).toHaveLength(1);
        expect(announcements[0].targetGroupName).toBe('Group 1');
        expect(announcements[0].dragDisabled).toBe(false);
        done();
      });
    });

    it('should handle target group id > 3 with default name', (done) => {
      const testAnnouncement = {
        ...mockPopupAnnouncement,
        targetGroupId: 5,
      };

      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncements,
        [testAnnouncement]
      );
      store.refreshState();

      component.popupAnnouncements$.subscribe((announcements) => {
        expect(announcements[0].targetGroupName).toBe('Target Group');
        done();
      });
    });

    it('should set dragDisabled true when announcement is not published', (done) => {
      const testAnnouncement = {
        ...mockPopupAnnouncement,
        isPublished: false,
      };

      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncements,
        [testAnnouncement]
      );
      store.refreshState();

      component.popupAnnouncements$.subscribe((announcements) => {
        expect(announcements[0].dragDisabled).toBe(true);
        done();
      });
    });

    it('should handle missing target group user item', (done) => {
      const testAnnouncement = {
        ...mockPopupAnnouncement,
        targetGroupId: 99,
      };

      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncements,
        [testAnnouncement]
      );
      store.refreshState();

      component.popupAnnouncements$.subscribe((announcements) => {
        expect(announcements[0].targetGroupName).toBe('Target Group');
        done();
      });
    });

    it('should map virtual popup announcements correctly', (done) => {
      component.virtualPopupAnnouncements$.subscribe((announcements) => {
        expect(announcements).toHaveLength(1);
        expect(announcements[0]).toEqual(
          expect.objectContaining({
            bannerId: mockPopupAnnouncement.bannerId,
            targetGroupName: 'Group 1',
          })
        );
        done();
      });
    });

    it('should get pagination data', (done) => {
      component.pagination$.subscribe((pagination) => {
        expect(pagination).toEqual(mockPagination);
        done();
      });
    });
  });

  describe('Event Handlers', () => {
    describe('onPageChange', () => {
      it('should dispatch setPopupAnnouncementsFilter with correct page', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        component.onPageChange(2);

        expect(dispatchSpy).toHaveBeenCalledWith(
          PopupAnnouncementActions.setPopupAnnouncementsFilter({
            filters: { page: 2 },
          })
        );
      });
    });

    describe('onPageSizeChange', () => {
      it('should dispatch setPopupAnnouncementsFilter with correct size and reset page', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        component.onPageSizeChange(20);

        expect(dispatchSpy).toHaveBeenCalled();
      });
    });

    describe('onRowClick', () => {
      const testPopupAnnouncement: PopupAnnouncement = {
        bannerId: 123,
        bannerName: 'Test',
        image: 'test.jpg',
        imageData: null,
        bannerType: 'popup',
        description: 'Test Description',
        displayOrder: 1,
        targetGroupId: 1,
        isPublished: true,
        publishType: 'immediate',
        dontShowButton: false,
        destinationType: 'url',
        destinationValue: 'https://example.com',
        frequencyCap: 1,
        frequencyPeriod: 'day',
        createdBy: 'admin',
        updatedBy: 'admin',
        createdDate: '2023-01-01',
        updatedDate: '2023-01-01',
        pageId: 1,
        pageName: 'Home',
        startDateTime: '2023-01-01T00:00:00Z',
        endDateTime: '2023-12-31T23:59:59Z',
        pagePosition: 1,
      };

      it('should navigate to edit page when not in edit mode and has permission', () => {
        component.hasEditPermission = true;
        component.isEditOrderMode.set(false);

        component.onRowClick(testPopupAnnouncement);

        expect(router.navigate).toHaveBeenCalledWith([
          'application-management',
          'popup-announcement-setting',
          'form-announcement',
          123,
          'view-edit',
        ]);
      });

      it('should not navigate when in edit mode', () => {
        component.hasEditPermission = true;
        component.isEditOrderMode.set(true);

        component.onRowClick(testPopupAnnouncement);

        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should not navigate when user has no edit permission', () => {
        component.hasEditPermission = false;
        component.isEditOrderMode.set(false);

        component.onRowClick(testPopupAnnouncement);

        expect(router.navigate).not.toHaveBeenCalled();
      });
    });

    describe('onDragDropChange', () => {
      it('should dispatch updatePopupAnnouncementsOrder', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const event: DragDropChange<PopupAnnouncementTable> = {
          data: [mockPopupAnnouncement],
        } as any;

        component.onDragDropChange(event);

        expect(dispatchSpy).toHaveBeenCalledWith(
          PopupAnnouncementOrderActions.updatePopupAnnouncementsOrder({
            newList: [mockPopupAnnouncement],
          })
        );
      });

      it('should handle empty drag drop data', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const event: DragDropChange<PopupAnnouncementTable> = {
          data: [],
        } as any;

        component.onDragDropChange(event);

        expect(dispatchSpy).toHaveBeenCalledWith(
          PopupAnnouncementOrderActions.updatePopupAnnouncementsOrder({
            newList: [],
          })
        );
      });
    });

    describe('onToggleChange', () => {
      it('should dispatch updatePublishedStatus when toggle is checked', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const event = { checked: true } as MatSlideToggleChange;

        component.onToggleChange(event, mockPopupAnnouncement);

        expect(dispatchSpy).toHaveBeenCalledWith(
          PopupAnnouncementOrderActions.updatePublishedStatus({
            id: 1,
            is_published: true,
          })
        );
      });

      it('should dispatch updatePublishedStatus when toggle is unchecked', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const event = { checked: false } as MatSlideToggleChange;

        component.onToggleChange(event, mockPopupAnnouncement);

        expect(dispatchSpy).toHaveBeenCalledWith(
          PopupAnnouncementOrderActions.updatePublishedStatus({
            id: 1,
            is_published: false,
          })
        );
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch reset actions and call super.ngOnDestroy', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const superDestroySpy = jest.spyOn(component['destroy$'], 'next');

      component.ngOnDestroy();

      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.resetPopupAnnouncements()
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.resetAll()
      );
      expect(superDestroySpy).toHaveBeenCalled();
    });
  });

  describe('Template Integration', () => {
    it('should display loading state correctly', () => {
      store.overrideSelector(selectIsLoading('getPopupAnnouncements'), true);
      store.refreshState();
      fixture.detectChanges();

      // The loading state should be reflected in the template
      // This tests the observable connection
      component.loading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
    });

    it('should display missing popup announcements loading state correctly', () => {
      store.overrideSelector(
        selectIsLoading('getMissingPopupAnnouncements'),
        true
      );
      store.refreshState();
      fixture.detectChanges();

      component.getMissingPopupAnnouncementsLoading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
    });

    it('should use virtual popup announcements when target group -1 is selected', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectselectedTargetGroupIds,
        [-1]
      );
      store.refreshState();

      component.selectselectedTargetGroupIds$.subscribe((targetGroupIds) => {
        expect(targetGroupIds).toContain(-1);
        done();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined target group user counts', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectTargetGroupUserCounts,
        []
      );
      store.refreshState();

      component.popupAnnouncements$.subscribe((announcements) => {
        expect(announcements[0].targetGroupName).toBe('');
        done();
      });
    });

    it('should handle multiple target group ids in target group user counts', (done) => {
      const multiTargetGroupUserCount = [
        { target_group_ids: [1, 2, 3], name: 'Multi Group' },
      ] as any;

      store.overrideSelector(
        popupAnnouncementSelectors.selectTargetGroupUserCounts,
        multiTargetGroupUserCount
      );
      store.refreshState();

      component.popupAnnouncements$.subscribe((announcements) => {
        expect(announcements[0].targetGroupName).toBe('Multi Group');
        done();
      });
    });
  });

  describe('Signal Updates', () => {
    it('should update isEditOrderMode signal when observable changes', () => {
      expect(component.isEditOrderMode()).toBe(false);

      store.overrideSelector(
        PopupAnnouncementOrderSelectors.selectIsEditOrderMode,
        true
      );
      store.refreshState();

      component.ngOnInit();

      expect(component.isEditOrderMode()).toBe(true);
    });

    it('should maintain signal state after multiple updates', () => {
      component.ngOnInit();

      // Test multiple state changes
      store.overrideSelector(
        PopupAnnouncementOrderSelectors.selectIsEditOrderMode,
        true
      );
      store.refreshState();
      expect(component.isEditOrderMode()).toBe(true);

      store.overrideSelector(
        PopupAnnouncementOrderSelectors.selectIsEditOrderMode,
        false
      );
      store.refreshState();
      expect(component.isEditOrderMode()).toBe(false);
    });
  });

  describe('Method Helpers', () => {
    it('should check isEditOrderMode correctly', () => {
      component.isEditOrderMode.set(true);
      expect(component.isEditOrderMode()).toBe(true);

      component.isEditOrderMode.set(false);
      expect(component.isEditOrderMode()).toBe(false);
    });
  });
});
