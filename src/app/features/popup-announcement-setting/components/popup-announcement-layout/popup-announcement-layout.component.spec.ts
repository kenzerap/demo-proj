import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupAnnouncementLayoutComponent } from './popup-announcement-layout.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, ReplaySubject, Subject, throwError } from 'rxjs';
import * as PopupAnnouncementActions from '../../stores/popup-announcement/popup-announcement.actions';
import * as PopupAnnouncementOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as popupAnnouncementSelectors from '../../stores/popup-announcement/popup-announcement.selectors';
import * as PopupAnnouncementOrderSelectors from '../../stores/reorder-list/reorder-list.selectors';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { selectIsLoading } from '@app/store/loading/loading.selectors';

describe('PopupAnnouncementLayoutComponent', () => {
  let component: PopupAnnouncementLayoutComponent;
  let fixture: ComponentFixture<PopupAnnouncementLayoutComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockDialogRef: any;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);

    mockDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
    };

    mockDialog = {
      open: jest.fn().mockReturnValue(mockDialogRef),
    } as unknown as jest.Mocked<MatDialog>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      snapshot: { params: {} },
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [PopupAnnouncementLayoutComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: popupAnnouncementSelectors.selectPopupAnnouncementTabs,
              value: [{ page_id: 1, page_name: 'Test Page', id: 1 }],
            },
            {
              selector: popupAnnouncementSelectors.selectSelectedTab,
              value: 1,
            },
            {
              selector: popupAnnouncementSelectors.selectTargetGroupUserCounts,
              value: [
                { id: '1', target_group_ids: [1], name: 'Group 1', count: 10 },
                { id: '2', target_group_ids: [2], name: 'Group 2', count: 20 },
              ],
            },
            {
              selector:
                popupAnnouncementSelectors.selectTargetGroupUserCountsPagination,
              value: { page: 0, totalPages: 2 },
            },
            {
              selector: popupAnnouncementSelectors.selectselectedTargetGroupIds,
              value: [1],
            },
            {
              selector: popupAnnouncementSelectors.selectPopupAnnouncements,
              value: [{ id: 1, title: 'Test Popup' }],
            },
            {
              selector: PopupAnnouncementOrderSelectors.selectIsOrderDirty,
              value: false,
            },
            {
              selector: popupAnnouncementSelectors.selectPreviewImages,
              value: [{ id: 1, url: 'test.jpg' }],
            },
            // Add loading state selectors
            {
              selector: selectIsLoading('getPopupAnnouncementTabs'),
              value: false,
            },
            {
              selector: selectIsLoading('getTargetGroupUserCount'),
              value: false,
            },
            {
              selector: selectIsLoading('reOrderPopupAnnouncements'),
              value: false,
            },
          ],
          // Add initial state for loading feature
          initialState: {
            loading: {
              isLoading: {
                getPopupAnnouncementTabs: false,
                getTargetGroupUserCount: false,
                reOrderPopupAnnouncements: false,
              },
            },
          },
        }),
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupAnnouncementLayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should dispatch getPopupAnnouncementTabs on init', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.getPopupAnnouncementTabs({
          isDropdownOptions: false,
        })
      );
    });

    it('should handle reOrderPopupAnnouncementsSuccess action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      actions$.next(
        PopupAnnouncementOrderActions.reOrderPopupAnnouncementsSuccess()
      );

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          message: 'The popup order was updated',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'success',
        },
        width: '25rem',
      });
    });
  });

  describe('Tab Navigation', () => {
    it('should handle tab change when warning check returns true', () => {
      const checkWarningSpy = jest.spyOn(component, 'checkWarningIsEditOrder$');
      checkWarningSpy.mockReturnValue(of(true));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.changeTab(2);

      expect(checkWarningSpy).toHaveBeenCalled();
      expect(component.targetGroupUserCountId()).toBe('');
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.resetAll()
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([2], {
        relativeTo: mockActivatedRoute,
      });
    });

    it('should not navigate when warning check returns false', () => {
      const checkWarningSpy = jest.spyOn(component, 'checkWarningIsEditOrder$');
      checkWarningSpy.mockReturnValue(of(false));

      component.changeTab(2);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Target Group Selection', () => {
    it('should handle target group selection when warning check returns true', () => {
      const checkWarningSpy = jest.spyOn(component, 'checkWarningIsEditOrder$');
      checkWarningSpy.mockReturnValue(of(true));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      const targetGroup = {
        id: '1',
        target_group_ids: [1],
        name: 'Group 1',
        count: 10,
      };

      component.selectTargetGroup(targetGroup);

      expect(component.targetGroupUserCountId()).toBe('1');
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.resetAll()
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.setPopupAnnouncementsFilter({
          filters: { targetGroupIds: [1], page: 0 },
        })
      );
    });

    it('should not select target group when warning check returns false', () => {
      const checkWarningSpy = jest.spyOn(component, 'checkWarningIsEditOrder$');
      checkWarningSpy.mockReturnValue(of(false));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      const targetGroup = {
        id: '1',
        target_group_ids: [1],
        name: 'Group 1',
        count: 10,
      };

      component.selectTargetGroup(targetGroup);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        PopupAnnouncementActions.setPopupAnnouncementsFilter(expect.any(Object))
      );
    });

    it('should handle "See more" target group selection', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.pageId.set(1);

      const seeMoreTargetGroup = {
        id: '-2',
        target_group_ids: [-2],
        name: 'See more',
        count: 0,
      };

      component.selectTargetGroup(seeMoreTargetGroup);

      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.getTargetGroupUserCount({
          pageId: 1,
          isGetMore: true,
        })
      );
    });

    it('should handle "See more" with undefined pageId', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.pageId.set(undefined);

      const seeMoreTargetGroup = {
        id: '-2',
        target_group_ids: [-2],
        name: 'See more',
        count: 0,
      };

      component.selectTargetGroup(seeMoreTargetGroup);

      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.getTargetGroupUserCount({
          pageId: 0,
          isGetMore: true,
        })
      );
    });
  });

  describe('Dialog Operations', () => {
    it('should open create new popup dialog with pageId', () => {
      component.pageId.set(1);
      component.openCreateNewPopupDialog();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [
          'application-management',
          'popup-announcement-setting',
          'form-announcement',
          'create',
        ],
        { queryParams: { pageId: 1 } }
      );
    });

    it('should open create new popup dialog without pageId', () => {
      component.pageId.set(undefined);
      component.openCreateNewPopupDialog();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [
          'application-management',
          'popup-announcement-setting',
          'form-announcement',
          'create',
        ],
        { queryParams: { pageId: undefined } }
      );
    });
  });

  describe('Edit Order Mode', () => {
    it('should set edit order mode to true', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setEditOrder(true);

      expect(component.isEditOrder()).toBe(true);
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.setIsEditOrderMode({ isEditOrder: true })
      );
    });

    it('should set edit order mode to false and reset dirty state', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setEditOrder(false);

      expect(component.isEditOrder()).toBe(false);
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.setIsEditOrderMode({ isEditOrder: false })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.setOrderDirty({ isDirty: false })
      );
    });

    it('should cancel edit order without dirty state', () => {
      component.isOrderDirty.set(false);
      const setEditOrderSpy = jest.spyOn(component, 'setEditOrder');

      component.cancelEditOrder();

      expect(setEditOrderSpy).toHaveBeenCalledWith(false);
      expect(mockDialog.open).not.toHaveBeenCalled();
    });

    it('should cancel edit order with dirty state and user confirms', () => {
      component.isOrderDirty.set(true);
      mockDialogRef.afterClosed.mockReturnValue(of(true));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.cancelEditOrder();

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Discard Changes?',
          message:
            'You have unsaved changes. If you cancel now, your changes will not be saved. Do you want to continue?',
          btnConfirmText: 'Discard',
          btnCloseText: 'Cancel',
          type: 'warning',
        },
        width: '25rem',
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.resetAll()
      );
    });

    it('should not cancel edit order when user rejects confirmation', () => {
      component.isOrderDirty.set(true);
      mockDialogRef.afterClosed.mockReturnValue(of(false));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.cancelEditOrder();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.resetAll()
      );
    });
  });

  describe('Publish Items', () => {
    it('should publish items when user confirms', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(true));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.publishItems();

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'You want to publish changes?',
          message:
            'The updated order will immediately affect customer-facing views. Please confirm to apply changes or cancel to continue editing.',
          btnConfirmText: 'Confirm',
          btnCloseText: 'Cancel',
          type: 'warning',
        },
        width: '25rem',
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.reOrderPopupAnnouncements()
      );
    });

    it('should not publish items when user cancels', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(false));
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.publishItems();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        PopupAnnouncementOrderActions.reOrderPopupAnnouncements()
      );
    });
  });

  describe('Warning Checks', () => {
    it('should return true when not in edit order mode', (done) => {
      component.isEditOrder.set(false);
      component.isOrderDirty.set(false);

      component.checkWarningIsEditOrder$().subscribe((result) => {
        expect(result).toBe(true);
        expect(mockDialog.open).not.toHaveBeenCalled();
        done();
      });
    });

    it('should return true when in edit order mode but not dirty', (done) => {
      component.isEditOrder.set(true);
      component.isOrderDirty.set(false);

      component.checkWarningIsEditOrder$().subscribe((result) => {
        expect(result).toBe(true);
        expect(mockDialog.open).not.toHaveBeenCalled();
        done();
      });
    });

    it('should show warning dialog when in edit order mode and dirty', (done) => {
      component.isEditOrder.set(true);
      component.isOrderDirty.set(true);
      mockDialogRef.afterClosed.mockReturnValue(of(true));

      component.checkWarningIsEditOrder$().subscribe((result) => {
        expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
          data: {
            title: 'Discard Changes?',
            message:
              'You have unsaved changes. If you cancel now, your changes will not be saved. Do you want to continue?',
            btnConfirmText: 'Discard',
            btnCloseText: 'Cancel',
            type: 'warning',
          },
          width: '25rem',
        });
        expect(result).toBe(true);
        done();
      });
    });

    it('should return false when user rejects warning dialog', (done) => {
      component.isEditOrder.set(true);
      component.isOrderDirty.set(true);
      mockDialogRef.afterClosed.mockReturnValue(of(false));

      component.checkWarningIsEditOrder$().subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });
  });

  describe('Target Group ID Comparison', () => {
    it('should return true for equal arrays when no targetGroupUserCountId is set', () => {
      component.targetGroupUserCountId.set('');
      const result = component.checkEqualTargetGroupIds([1, 2], [2, 1], '1');
      expect(result).toBe(true);
    });

    it('should return false for different arrays when no targetGroupUserCountId is set', () => {
      component.targetGroupUserCountId.set('');
      const result = component.checkEqualTargetGroupIds([1, 2], [3, 4], '1');
      expect(result).toBe(false);
    });

    it('should return true when targetGroupUserCountId matches and arrays are equal', () => {
      component.targetGroupUserCountId.set('1');
      const result = component.checkEqualTargetGroupIds([1, 2], [2, 1], '1');
      expect(result).toBe(true);
    });

    it('should return false when targetGroupUserCountId does not match', () => {
      component.targetGroupUserCountId.set('2');
      const result = component.checkEqualTargetGroupIds([1, 2], [2, 1], '1');
      expect(result).toBe(false);
    });

    it('should return false when targetGroupUserCountId matches but arrays are different', () => {
      component.targetGroupUserCountId.set('1');
      const result = component.checkEqualTargetGroupIds([1, 2], [3, 4], '1');
      expect(result).toBe(false);
    });
  });

  describe('Observables', () => {
    it('should transform tabs observable to add "Popup" suffix', (done) => {
      component.tabs$.subscribe((tabs) => {
        expect(tabs).toEqual([
          { page_id: 1, page_name: 'Test Page Popup', id: 1 },
        ]);
        done();
      });
    });

    it('should create target group user count observable with "View all" and "See more" options', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectTargetGroupUserCountsPagination,
        {
          page: 0,
          totalPages: 2,
        } as any
      );
      store.refreshState();

      component.targetGroupUserCount$.subscribe((groups) => {
        expect(groups).toHaveLength(4); // View all + 2 groups + See more
        expect(groups[0].name).toBe('View all popups');
        expect(groups[0].target_group_ids).toEqual([-1]);
        expect(groups[groups.length - 1].name).toBe('See more');
        expect(groups[groups.length - 1].target_group_ids).toEqual([-2]);
        done();
      });
    });

    it('should not add "See more" option when on last page', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectTargetGroupUserCountsPagination,
        {
          page: 1,
          totalPages: 2,
        } as any
      );
      store.refreshState();

      component.targetGroupUserCount$.subscribe((groups) => {
        expect(groups).toHaveLength(3); // View all + 2 groups (no See more)
        expect(groups[groups.length - 1].name).not.toBe('See more');
        done();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle store state changes on init', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      // Simulate state change
      store.overrideSelector(
        popupAnnouncementSelectors.selectselectedTargetGroupIds,
        [1]
      );
      store.overrideSelector(popupAnnouncementSelectors.selectSelectedTab, 2);
      store.refreshState();

      expect(component.pageId()).toBe(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.getPublishedImages()
      );
    });

    it('should handle isOrderDirty changes', () => {
      store.overrideSelector(
        PopupAnnouncementOrderSelectors.selectIsOrderDirty,
        true
      );
      store.refreshState();

      expect(component.isOrderDirty()).toBe(true);
    });

    it('should dispatch resetAll on destroy', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.ngOnDestroy();

      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.resetAll()
      );
    });
  });

  describe('Success Action Handling', () => {
    it('should handle reOrderPopupAnnouncementsSuccess and show success dialog', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      mockDialogRef.afterClosed.mockReturnValue(of(true));

      actions$.next(
        PopupAnnouncementOrderActions.reOrderPopupAnnouncementsSuccess()
      );

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          message: 'The popup order was updated',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'success',
        },
        width: '25rem',
      });

      // Test dialog close handling
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.setPopupAnnouncementsFilter({
          filters: { page: 0 },
        })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        PopupAnnouncementActions.getPublishedImages()
      );
    });
  });

  describe('Loading States', () => {
    it('should handle loading states for tabs', () => {
      store.overrideSelector(
        selectIsLoading('getPopupAnnouncementTabs'),
        false
      );
      store.refreshState();

      component.tabsLoading$.subscribe((loading) => {
        expect(typeof loading).toBe('boolean');
      });
    });

    it('should handle loading states for target groups', () => {
      store.overrideSelector(
        selectIsLoading('reOrderPopupAnnouncements'),
        false
      );
      store.refreshState();

      component.targetGroupsLoading$.subscribe((loading) => {
        expect(typeof loading).toBe('boolean');
      });
    });

    it('should handle loading states for reorder', () => {
      store.overrideSelector(
        selectIsLoading('reOrderPopupAnnouncements'),
        false
      );
      store.refreshState();

      component.reOrderLoading$.subscribe((loading) => {
        expect(typeof loading).toBe('boolean');
      });
    });

    it('should handle loading state changes', () => {
      store.overrideSelector(selectIsLoading('getPopupAnnouncementTabs'), true);
      store.refreshState();

      component.tabsLoading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty target group user counts', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectTargetGroupUserCounts,
        []
      );
      store.refreshState();

      component.targetGroupUserCount$.subscribe((groups) => {
        expect(groups).toHaveLength(2); // Only "View all" and "See more"
        done();
      });
    });

    it('should handle null selectedTargetGroupIds in filter condition', () => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectselectedTargetGroupIds,
        undefined
      );
      store.refreshState();

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.ngOnInit();

      // Should not dispatch getPublishedImages because filter condition fails
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        PopupAnnouncementActions.getPublishedImages()
      );
    });

    it('should handle undefined pageId in filter condition', () => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectSelectedTab,
        undefined
      );
      store.refreshState();

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.ngOnInit();

      // Should not dispatch getPublishedImages because filter condition fails
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        PopupAnnouncementActions.getPublishedImages()
      );
    });
  });

  describe('Signal Updates', () => {
    it('should update pageId signal when selectedTab changes', () => {
      store.overrideSelector(popupAnnouncementSelectors.selectSelectedTab, 5);
      store.refreshState();

      expect(component.pageId()).toBe(5);
    });

    it('should update isOrderDirty signal when selectIsOrderDirty changes', () => {
      store.overrideSelector(
        PopupAnnouncementOrderSelectors.selectIsOrderDirty,
        true
      );
      store.refreshState();

      expect(component.isOrderDirty()).toBe(true);
    });
  });
});
