import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivilegeLayoutComponent } from './privilege-layout.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import * as privilegesActions from '../../stores/privilege/privilege.actions';
import * as privilegesSelectors from '../../stores/privilege/privilege.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { PrivilegeTypeEnum } from '../../../../shared/utils/enums/privilege-type.enums';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrivilegeLayoutComponent', () => {
  let component: PrivilegeLayoutComponent;
  let fixture: ComponentFixture<PrivilegeLayoutComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;
  let activatedRouteMock: { queryParams: any };

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    activatedRouteMock = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [PrivilegeLayoutComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: privilegesSelectors.selectTargetGroupUserCounts,
              value: [],
            },
            {
              selector: privilegesSelectors.selectTargetGroupUserCountsPagination,
              value: { page: 0, size: 5, totalItems: 0, totalPages: 0 },
            },
            {
              selector: privilegesSelectors.selectSelectedTargetGroupIds,
              value: [1, 2],
            },
            {
              selector: privilegesSelectors.selectSelectedTab,
              value: PrivilegeTypeEnum.E_VOUCHER,
            },
            {
              selector: selectIsLoading('getTargetGroupUserCount'),
              value: false,
            },
          ],
        }),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivilegeLayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize activeTabUrl from the selected privilege type', () => {
    expect(component.activeTabUrl()).toBe('e-voucher');
  });

  it('should dispatch resetAll on ngOnInit when not navigating back', () => {
    expect(store.dispatch).toHaveBeenCalledWith(privilegesActions.resetAll());
  });

  it('should navigate to the active tab and not dispatch resetAll when navigating back', () => {
    (store.dispatch as jest.Mock).mockClear();
    activatedRouteMock.queryParams = of({ isBack: 'true' });
    fixture = TestBed.createComponent(PrivilegeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['e-voucher'], {
      relativeTo: activatedRouteMock,
      queryParams: { isBack: true },
    });
    expect(store.dispatch).not.toHaveBeenCalledWith(
      privilegesActions.resetAll()
    );
  });

  it('should navigate to the correct tab on changeTab', () => {
    component.changeTab('delivery');
    expect(router.navigate).toHaveBeenCalledWith(['delivery'], {
      relativeTo: activatedRouteMock,
    });
    expect(component.targetGroupUserCountId()).toBe('');
  });

  it('should dispatch setPrivilegeSettingsFilter on selectTargetGroup', () => {
    const targetGroup = {
      id: '1',
      target_group_ids: [1, 2],
      count: 10,
      name: 'Test Group',
    };
    component.selectTargetGroup(targetGroup);
    expect(component.targetGroupUserCountId()).toBe('1');
    expect(store.dispatch).toHaveBeenCalledWith(
      privilegesActions.setPrivilegeSettingsFilter({
        filters: { target_group_ids: [1, 2], page: 0 },
      })
    );
  });

  it('should dispatch getTargetGroupUserCount with isGetMore when selecting the "see more" group', () => {
    component.selectTargetGroup({
      id: '-2',
      target_group_ids: [-2],
      count: 0,
      name: 'See more',
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      privilegesActions.getTargetGroupUserCount({
        privilegeType: component.privilegeType(),
        isGetMore: true,
      })
    );
  });

  it('should correctly compare target group IDs in checkEqualTargetGroupIds', () => {
    const arrayA = [1, 2];
    const arrayB = [2, 1];
    const id = '1';

    component.targetGroupUserCountId.set('');
    expect(component.checkEqualTargetGroupIds(arrayA, arrayB, id)).toBe(true);

    component.targetGroupUserCountId.set('1');
    expect(component.checkEqualTargetGroupIds(arrayA, arrayB, id)).toBe(true);

    component.targetGroupUserCountId.set('2');
    expect(component.checkEqualTargetGroupIds(arrayA, arrayB, id)).toBe(false);
  });

  it('should navigate to create privilege on navigateCreatePrivilege', () => {
    component.navigateCreatePrivilege();
    expect(router.navigate).toHaveBeenCalledWith(['form', 'create'], {
      relativeTo: activatedRouteMock,
    });
  });
});
