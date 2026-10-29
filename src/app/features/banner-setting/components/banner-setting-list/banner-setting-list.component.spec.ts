import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerSettingListComponent } from './banner-setting-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import * as BannerSettingActions from '../../stores/banner-setting/banner-setting.actions';
import * as BannerSettingOrderActions from '../../stores/reorder-list/reorder-list.actions';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  BannerSetting,
  BannerSettingTable,
} from '../../models/banner-setting-model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as bannerSettingSelectors from '../../stores/banner-setting/banner-setting.selectors';
import * as bannerSettingOrderSelectors from '../../stores/reorder-list/reorder-list.selectors';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';

describe('BannerSettingListComponent', () => {
  let component: BannerSettingListComponent;
  let fixture: ComponentFixture<BannerSettingListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;
  let activatedRoute: jest.Mocked<ActivatedRoute>;

  const bannerSettings = [
    { banner_id: 1, target_group_id: 2, is_published: true } as any,
    { banner_id: 2, target_group_id: 4, is_published: false } as any,
  ];
  const virtualBannerSettings = [
    { banner_id: 3, target_group_id: 1, is_published: true } as any,
    { banner_id: 4, target_group_id: 5, is_published: false } as any,
  ];
  const targetGroupUserCount = [
    { target_group_ids: [1, 2], name: 'Group A' },
    { target_group_ids: [4, 5], name: 'Group B' },
  ];

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    activatedRoute = {
      params: of({ tabId: '1' }),
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [BannerSettingListComponent, NoopAnimationsModule, MatNativeDateModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: bannerSettingSelectors.selectBannerSettings,
              value: bannerSettings,
            },
            {
              selector: bannerSettingOrderSelectors.selectVirtualBannerSettings,
              value: virtualBannerSettings,
            },
            {
              selector: bannerSettingSelectors.selectTargetGroupUserCounts,
              value: targetGroupUserCount,
            },
          ],
        }),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BannerSettingListComponent);
    component = fixture.componentInstance;
    component.hasEditPermission = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        BannerSettingActions.getTargetGroupUserCount({ pageId: 1 })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        BannerSettingActions.setBannerSettingsFilter({
          filters: { page_id: 1, page: 0, target_group_ids: [1] },
        })
      );
    }, 0);
  });

  it('should dispatch setBannerSettingsFilter on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingActions.setBannerSettingsFilter({ filters: { page: 2 } })
    );
  });

  it('should dispatch setBannerSettingsFilter on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(20);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingActions.setBannerSettingsFilter({
        filters: { size: 20, page: 0 },
      })
    );
  });

  it('should navigate to the correct route on onRowClick when not in edit mode', () => {
    component.isEditOrderMode.set(false);
    const bannerSetting = { banner_id: 123 } as any;
    component.onRowClick(bannerSetting);
    expect(router.navigate).toHaveBeenCalledWith([
      'application-management',
      'banner-setting',
      'form-banner',
      123,
      'view-edit',
    ]);
  });

  it('should not navigate on onRowClick when in edit mode', () => {
    component.isEditOrderMode.set(true);
    const bannerSetting = { banner_id: 123 } as any;
    component.onRowClick(bannerSetting);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return a valid Date object from getDateTime', () => {
    const date = component.getDateTime('01/01/2023', '12:00:00');
    expect(date).toEqual(new Date(2023, 0, 1, 12, 0, 0));
  });

  it('should dispatch updateBannerSettingsOrder on onDragDropChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event: DragDropChange<any> = {
      data: [
        { is_published: true, display_order: 1 },
        { is_published: true, display_order: 2 },
      ],
    } as any;
    component.onDragDropChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingOrderActions.updateBannerSettingsOrder({
        newList: [
          { is_published: true, display_order: 1 },
          { is_published: true, display_order: 2 },
        ] as BannerSetting[],
      })
    );
  });

  it('should dispatch updatePublishedStatus on onToggleChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { checked: true } as MatSlideToggleChange;
    const rowData = { banner_id: 123 } as any;
    component.onToggleChange(event, rowData);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingOrderActions.updatePublishedStatus({
        id: 123,
        is_published: true,
      })
    );
  });

  it('should dispatch resetBannerSettings on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingActions.resetBannerSettings()
    );
  });

  it('should update isEditOrderMode signal on isEditOrderMode$ change', () => {
    component.isEditOrderMode.set(false);
    (component as any).isEditOrderMode$.subscribe((val: boolean) => {
      component.isEditOrderMode.set(val);
    });
    expect(component.isEditOrderMode()).toBe(false);
  });

  it('should dispatch setBannerSettingsFilter on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingActions.setBannerSettingsFilter({ filters: { page: 2 } })
    );
  });

  it('should dispatch setBannerSettingsFilter on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(20);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingActions.setBannerSettingsFilter({
        filters: { size: 20, page: 0 },
      })
    );
  });

  it('should not navigate if hasEditPermission is false', () => {
    component.hasEditPermission = false;
    component.onRowClick({} as any);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate if isEditOrderMode is true', () => {
    component.hasEditPermission = true;
    component.isEditOrderMode.set(true);
    component.onRowClick({ banner_id: 1 } as any);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to view-edit if hasEditPermission and not in edit order mode', () => {
    component.hasEditPermission = true;
    component.isEditOrderMode.set(false);
    component.onRowClick({ banner_id: 123 } as any);
    expect(router.navigate).toHaveBeenCalledWith([
      'application-management',
      'banner-setting',
      'form-banner',
      123,
      'view-edit',
    ]);
  });

  it('should return correct Date from getDateTime', () => {
    const date = component.getDateTime('01/02/2023', '10:11:12');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2023);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(10);
    expect(date.getMinutes()).toBe(11);
    expect(date.getSeconds()).toBe(12);
  });

  it('should dispatch updateBannerSettingsOrder on onDragDropChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event: DragDropChange<BannerSettingTable> = {
      data: [{ banner_id: 1 }],
    } as any;
    component.onDragDropChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingOrderActions.updateBannerSettingsOrder({
        newList: [{ banner_id: 1 } as any],
      })
    );
  });

  it('should dispatch updatePublishedStatus on onToggleChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { checked: true } as MatSlideToggleChange;
    const rowData = { banner_id: 1 } as BannerSettingTable;
    component.onToggleChange(event, rowData);
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingOrderActions.updatePublishedStatus({
        id: 1,
        is_published: true,
      })
    );
  });

  it('should dispatch reset actions on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingActions.resetBannerSettings()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      BannerSettingOrderActions.resetAll()
    );
  });

  it('should map bannerSettings$ with correct targetGroupName and dragDisabled', (done) => {
    component.bannerSettings$.subscribe((result) => {
      expect(result.length).toBe(2);
      expect(result[0].targetGroupName).toBe('Group A'); // target_group_id 2 in [1,2]
      expect(result[0].dragDisabled).toBe(false); // is_published true
      expect(result[1].targetGroupName).toBe('Target Group'); // target_group_id 4 > 3
      expect(result[1].dragDisabled).toBe(true); // is_published false
      done();
    });
  });

  it('should map virtualBannerSettings$ with correct targetGroupName and dragDisabled', (done) => {
    component.virtualBannerSettings$.subscribe((result) => {
      expect(result.length).toBe(2);
      expect(result[0].targetGroupName).toBe('Group A'); // target_group_id 1 in [1,2]
      expect(result[0].dragDisabled).toBe(false); // is_published true
      expect(result[1].targetGroupName).toBe('Target Group'); // target_group_id 5 > 3
      expect(result[1].dragDisabled).toBe(true); // is_published false
      done();
    });
  });
});
