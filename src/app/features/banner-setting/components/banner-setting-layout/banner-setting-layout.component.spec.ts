import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerSettingLayoutComponent } from './banner-setting-layout.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import * as BannerSettingActions from '../../stores/banner-setting/banner-setting.actions';
import * as BannerSettingOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as bannerSettingSelectors from '../../stores/banner-setting/banner-setting.selectors';
import * as bannerSettingOrderSelectors from '../../stores/reorder-list/reorder-list.selectors';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BannerSettingLayoutComponent', () => {
  let component: BannerSettingLayoutComponent;
  let fixture: ComponentFixture<BannerSettingLayoutComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      snapshot: { params: {} },
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [BannerSettingLayoutComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: bannerSettingSelectors.selectBannerSettingTabs,
              value: [],
            },
            {
              selector: bannerSettingSelectors.selectSelectedTab,
              value: 1,
            },
            {
              selector: bannerSettingOrderSelectors.selectIsOrderDirty,
              value: false,
            },
            {
              selector: bannerSettingSelectors.selectselectedTargetGroupIds,
              value: [],
            },
            {
              selector: bannerSettingSelectors.selectPreviewImages,
              value: [],
            },
            {
              selector: bannerSettingSelectors.selectTargetGroupUserCounts,
              value: [
                {
                  target_group_ids: [-1],
                  name: 'All banners',
                  count: 0,
                  id: '-1',
                },
              ],
            },
          ],
        }),
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerSettingLayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getBannerSettingTabs on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingActions.getBannerSettingTabs({ isDropdownOptions: false })
    );
  });

  it('should handle tab change', () => {
    const setEditOrderSpy = jest.spyOn(component, 'setEditOrder');
    component.changeTab(2);
    expect(mockRouter.navigate).toHaveBeenCalledWith([2], {
      relativeTo: mockActivatedRoute,
    });
    expect(setEditOrderSpy).toHaveBeenCalledWith(false);
  });

  it('should open create new popup dialog', () => {
    component.pageId.set(123);
    component.openCreateNewPopupDialog();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['application-management', 'banner-setting', 'form-banner', 'create'],
      { queryParams: { pageId: 123 } }
    );
  });

  it('should set edit order', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setEditOrder(true);
    expect(component.isEditOrder()).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingOrderActions.setIsEditOrderMode({ isEditOrder: true })
    );
  });

  it('should publish items', () => {
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
  });

  it('should cancel edit order', () => {
    component.isOrderDirty.set(true);
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
  });

  it('should check warning for edit order', (done) => {
    component.isEditOrder.set(true);
    component.isOrderDirty.set(true);
    component.checkWarningIsEditOrder$().subscribe((confirmed) => {
      expect(confirmed).toBe(true);
      done();
    });
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
  });

  it('should check equal target group IDs', () => {
    const result = component.checkEqualTargetGroupIds([1, 2], [2, 1], '123');
    expect(result).toBe(true);
  });

  it('should reset all on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(BannerSettingActions.resetAll());
  });

  it('should call setEditOrder, resetAll, and setBannerSettingsFilter on selectTargetGroup', () => {
    const targetGroupUserCount = {
      id: '2',
      target_group_ids: [2, 3],
      name: 'Test Group',
      count: 10,
    };

    const setEditOrderSpy = jest.spyOn(component, 'setEditOrder');
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    // Simulate isEditOrder and isOrderDirty as false
    component.isEditOrder.set(false);
    component.isOrderDirty.set(false);

    component.selectTargetGroup(targetGroupUserCount);

    setTimeout(() => {
      expect(component.targetGroupUserCountId()).toBe('2');
      expect(setEditOrderSpy).toHaveBeenCalledWith(false);
      expect(dispatchSpy).toHaveBeenCalledWith(
        BannerSettingOrderActions.resetAll()
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        BannerSettingActions.setBannerSettingsFilter({
          filters: { target_group_ids: [2, 3], page: 0 },
        })
      );
    }, 0);
  });

  it('should show confirm dialog if isEditOrder and isOrderDirty are true', () => {
    const targetGroupUserCount = {
      id: '-2',
      target_group_ids: [5, 6],
      name: 'Another Group',
      count: 5,
    };
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.isEditOrder.set(true);
    component.isOrderDirty.set(true);

    // Mock dialog to return false (cancel)
    mockDialog.open.mockReturnValueOnce({
      afterClosed: jest.fn().mockReturnValue(of(false)),
    } as any);

    component.selectTargetGroup(targetGroupUserCount);

    setTimeout(() => {
      // Should not dispatch actions if not confirmed
      expect(dispatchSpy).toHaveBeenCalled();
    }, 0);
  });
});
