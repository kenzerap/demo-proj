import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvoucherListComponent } from './evoucher-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import * as PrivilegesActions from '../../stores/privilege/privilege.actions';
import * as privilegesSelectors from '../../stores/privilege/privilege.selectors';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { selectPermissions } from '@app/store/user-permission/user-permission.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';

describe('EvoucherListComponent', () => {
  let component: EvoucherListComponent;
  let fixture: ComponentFixture<EvoucherListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [EvoucherListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: privilegesSelectors.selectPrivilegeSettings,
              value: [],
            },
            {
              selector: privilegesSelectors.selectIsEditOrderMode,
              value: false,
            },
            {
              selector: privilegesSelectors.selectPagination,
              value: { page: 0, size: 20, totalItems: 0, totalPages: 0 },
            },
            {
              selector: privilegesSelectors.selectTargetGroupUserCounts,
              value: [],
            },
            { selector: selectIsLoading('getPrivilegeSettings'), value: false },
            { selector: selectPermissions, value: {} },
          ],
        }),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EvoucherListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setPrivilegeSettingsFilter on ngOnInit', () => {
    const mockTargetGroupUserCount: TargetGroupUserCount[] = [
      { target_group_ids: [1, 2], count: 10, id: '1', name: 'Group 1' },
    ];
    store.overrideSelector(
      privilegesSelectors.selectTargetGroupUserCounts,
      mockTargetGroupUserCount
    );
    store.refreshState();

    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegesActions.getTargetGroupUserCount({
        privilegeType: PrivilegeTypeEnum.E_VOUCHER,
      })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegesActions.setPrivilegeSettingsFilter({
        filters: {
          page: 0,
          size: 20,
          privilege_type: PrivilegeTypeEnum.E_VOUCHER,
          target_group_ids: [1, 2],
          keyword: '',
          privilegeId: '',
        },
      })
    );
  });

  it('should dispatch setPrivilegeSettingsFilter with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegesActions.setPrivilegeSettingsFilter({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setPrivilegeSettingsFilter with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegesActions.setPrivilegeSettingsFilter({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should navigate to the correct route on onRowClick when hasEditPermission is true', () => {
    component.hasEditPermission = true;
    const privilege = { privilege_id: 123 } as any;
    component.onRowClick(privilege);
    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'privilege-setting',
      'form',
      123,
      'view-edit',
    ]);
  });

  it('should not navigate on onRowClick when hasEditPermission is false', () => {
    component.hasEditPermission = false;
    component.onRowClick({ privilege_id: 123 } as any);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
