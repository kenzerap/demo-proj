import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExcludePointByPolicyNoListComponent } from './exclude-point-by-policy-no-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, ReplaySubject } from 'rxjs';
import * as ExcludePointByPolicyNoActions from '../../stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.actions';
import * as excludePointByPolicyNoSelectors from '../../stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.selectors';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ExcludePointPolicy } from '../../models/exclude-point-policy.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ExcludePointByPolicyNoListColumns } from '../../constants/exclude-point-by-policy-no-list-columns.const';

describe('ExcludePointByPolicyNoListComponent', () => {
  let component: ExcludePointByPolicyNoListComponent;
  let fixture: ComponentFixture<ExcludePointByPolicyNoListComponent>;
  let store: MockStore;
  let dialog: jest.Mocked<MatDialog>;
  let actions$: ReplaySubject<any>;
  let mockSelectPolicies: MemoizedSelector<any, ExcludePointPolicy[]>;
  let mockSelectPagination: MemoizedSelector<any, Pagination>;
  let mockSelectFilters: MemoizedSelector<any, Partial<CommonListQueryParams>>;
  let mockSelectLoading: MemoizedSelector<any, boolean>;
  let mockSelectDeleting: MemoizedSelector<any, boolean>;

  const mockDialogRefClosed = (result: any) => ({
    afterClosed: jest.fn().mockReturnValue(of(result)),
  });

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);

    dialog = {
      open: jest.fn().mockReturnValue(mockDialogRefClosed(true)),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [ExcludePointByPolicyNoListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: dialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcludePointByPolicyNoListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    mockSelectPolicies = store.overrideSelector(
      excludePointByPolicyNoSelectors.selectExcludePointPolicies,
      [],
    );
    mockSelectPagination = store.overrideSelector(
      excludePointByPolicyNoSelectors.selectPagination,
      { page: 0, size: 20, totalItems: 0, totalPages: 0 },
    );
    mockSelectFilters = store.overrideSelector(
      excludePointByPolicyNoSelectors.selectExcludePointPolicyFilters,
      { keyword: '', page: 0, size: 20 },
    );
    mockSelectLoading = store.overrideSelector(
      selectIsLoading('getExcludePointPolicies'),
      false,
    );
    mockSelectDeleting = store.overrideSelector(
      selectIsLoading('deleteExcludePointPolicy'),
      false,
    );

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise tableColumns signal with ExcludePointByPolicyNoListColumns', () => {
    expect(component.tableColumns()).toEqual(ExcludePointByPolicyNoListColumns);
  });

  it('should dispatch setExcludePointPolicyFilters with default params on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
        filters: { page: 0, size: 20 },
      }),
    );
  });

  it('should open success dialog when addPolicyToExcludePointSuccess action fires', () => {
    component.ngOnInit();

    actions$.next(
      ExcludePointByPolicyNoActions.addPolicyToExcludePointSuccess({
        excludePointPolicy: {} as ExcludePointPolicy,
      }),
    );

    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        message: 'The policy was added',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'success',
      },
      width: '25rem',
    });
  });

  it('should dispatch setExcludePointPolicyFilters after add-success dialog closes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();

    actions$.next(
      ExcludePointByPolicyNoActions.addPolicyToExcludePointSuccess({
        excludePointPolicy: {} as ExcludePointPolicy,
      }),
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
        filters: { page: 0, size: 20 },
      }),
    );
  });

  it('should open success dialog when deleteExcludePointPolicySuccess action fires', () => {
    component.ngOnInit();

    actions$.next(
      ExcludePointByPolicyNoActions.deleteExcludePointPolicySuccess(),
    );

    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        message: 'The record was deleted',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'success',
      },
      width: '25rem',
    });
  });

  it('should dispatch setExcludePointPolicyFilters after delete-success dialog closes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();

    actions$.next(
      ExcludePointByPolicyNoActions.deleteExcludePointPolicySuccess(),
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
        filters: { page: 0, size: 20 },
      }),
    );
  });

  it('should dispatch setExcludePointPolicyFilters with page on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(3);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
        filters: { page: 3 },
      }),
    );
  });

  it('should dispatch setExcludePointPolicyFilters with size and reset page on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(50);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.setExcludePointPolicyFilters({
        filters: { size: 50, page: 0 },
      }),
    );
  });

  it('should open confirm dialog on deleteExcludePointPolicy', () => {
    const rowData: ExcludePointPolicy = {
      excluded_policy_id: 1,
      policy_no: 'P001',
      product_name: 'Product A',
      party_ids: [],
      created_by: 'user',
      created_date: '2024-01-01',
      updated_date: '2024-01-02',
    };

    component.deleteExcludePointPolicy(rowData);

    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'Delete Record?',
        message: 'Are you sure you want to delete this record?',
        btnCloseText: 'Cancel',
        btnConfirmText: 'Confirm',
        type: 'warning',
      },
      width: '25rem',
    });
  });

  it('should dispatch deleteExcludePointPolicy when confirm dialog returns true', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const rowData: ExcludePointPolicy = {
      excluded_policy_id: 42,
      policy_no: 'P001',
      product_name: 'Product A',
      party_ids: [],
      created_by: 'user',
      created_date: '2024-01-01',
      updated_date: '2024-01-02',
    };

    component.deleteExcludePointPolicy(rowData);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.deleteExcludePointPolicy({
        excluded_policy_id: 42,
      }),
    );
  });

  it('should not dispatch deleteExcludePointPolicy when confirm dialog returns false', () => {
    dialog.open.mockReturnValue(mockDialogRefClosed(false) as any);
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const rowData: ExcludePointPolicy = {
      excluded_policy_id: 42,
      policy_no: 'P001',
      product_name: 'Product A',
      party_ids: [],
      created_by: 'user',
      created_date: '2024-01-01',
      updated_date: '2024-01-02',
    };

    component.deleteExcludePointPolicy(rowData);

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.deleteExcludePointPolicy(
        expect.anything(),
      ),
    );
  });

  it('should dispatch resetAll and complete destroy$ on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const destroyNextSpy = jest.spyOn(component.destroy$, 'next');
    const destroyCompleteSpy = jest.spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoActions.resetAll(),
    );
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });
});
