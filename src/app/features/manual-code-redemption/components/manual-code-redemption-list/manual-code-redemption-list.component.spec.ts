import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, ReplaySubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as ManualCodeRedemptionActions from '../../stores/manual-code-redemption/manual-code-redemption.actions';
import * as ManualCodeRedemptionSelectors from '../../stores/manual-code-redemption/manual-code-redemption.selector';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ManualCodeRedemptionComponent } from './manual-code-redemption-list.component';
import { provideMockActions } from '@ngrx/effects/testing';
import { MatDialog } from '@angular/material/dialog';

describe('ManualCodeRedemptionComponent', () => {
  let component: ManualCodeRedemptionComponent;
  let fixture: ComponentFixture<ManualCodeRedemptionComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let actions$ = new ReplaySubject(1);
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ManualCodeRedemptionComponent,
        MatDatepickerModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({}),
        provideMockActions(() => actions$),
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualCodeRedemptionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onPageChange', () => {
    it('should dispatch setManualCodeRedemptionFilters with new page', () => {
      component.onPageChange(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ManualCodeRedemptionActions.setManualCodeRedemptionFilters({
          filters: { page: 2 },
        })
      );
    });
  });

  describe('onPageSizeChange', () => {
    it('should dispatch setManualCodeRedemptionFilters with new size and reset page', () => {
      component.onPageSizeChange(50);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ManualCodeRedemptionActions.setManualCodeRedemptionFilters({
          filters: { size: 50, page: 0 },
        })
      );
    });
  });

  describe('tableColumns', () => {
    it('should return an array', () => {
      expect(Array.isArray(component.tableColumns())).toBe(true);
    });
  });

  describe('hasFilter', () => {
    it('should return false if filters is null', () => {
      expect(component.hasFilter(null as any)).toBe(false);
    });

    it('should return true if search_text is set', () => {
      expect(component.hasFilter({ search_text: 'A' })).toBe(true);
    });

    it('should return false if all filters are empty', () => {
      expect(component.hasFilter({})).toBe(false);
    });
  });

  describe('tableColumns', () => {
    it('should return an array', () => {
      expect(Array.isArray(component.tableColumns())).toBe(true);
    });
  });

  it('should dispatch setManualCodeRedemptionFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      ManualCodeRedemptionActions.setManualCodeRedemptionFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setUserAccountReportsFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      ManualCodeRedemptionActions.setManualCodeRedemptionFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should emit selectCommonSearch$ as true when filters have search_text', (done) => {
    store.overrideSelector(
      ManualCodeRedemptionSelectors.selectManualCodeRedemptionFilters,
      { search_text: 'test' }
    );
    store.refreshState();
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(true);
      done();
    });
  });

  it('should have selectCommonSearch$ emit false when filters are empty', (done) => {
    store.overrideSelector(
      ManualCodeRedemptionSelectors.selectManualCodeRedemptionFilters,
      {}
    );
    store.refreshState();
    component.selectCommonSearch$.subscribe((val) => {
      expect(val).toBe(false);
      done();
    });
  });

  it('should emit selectSearchHighlightText$ as search_text', (done) => {
    store.overrideSelector(
      ManualCodeRedemptionSelectors.selectManualCodeRedemptionFilters,
      { search_text: 'test' }
    );
    store.refreshState();
    component.selectSearchHighlightText$.subscribe((val) => {
      expect(val).toBe('test');
      done();
    });
  });

  it('should emit selectSearchHighlightText$ as empty string when filters are empty', (done) => {
    store.overrideSelector(
      ManualCodeRedemptionSelectors.selectManualCodeRedemptionFilters,
      {}
    );
    store.refreshState();
    component.selectSearchHighlightText$.subscribe((val) => {
      expect(val).toBe('');
      done();
    });
  });

  describe('tableColumns', () => {
    it('should return the correct columns', () => {
      const columns = component.tableColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });
  });

  describe('markAsRedeem', () => {
    it('should not open dialog if status is redeemed', () => {
      const rowData = { status: 'REDEEMED' } as any;
      const openSpy = jest.spyOn(dialog, 'open');
      component.markAsRedeem(rowData);
      expect(openSpy).not.toHaveBeenCalled();
    });

    it('should open dialog and dispatch updateManualCodeRedemptionStatus if confirmed', () => {
      const rowData = {
        status: 'AVAILABLE',
        promo_code_unicode_quota_allocation_detail_id: 1,
        type: 'SOME_TYPE',
        created_by: 'admin',
      } as any;
      const afterClosed$ = of(true);
      const openSpy = jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => afterClosed$,
      } as any);

      component.markAsRedeem(rowData);

      expect(openSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        ManualCodeRedemptionActions.updateManualCodeRedemptionStatus({
          params: {
            id: 1,
            type: 'SOME_TYPE',
            action_done_by: 'admin',
          },
        })
      );
    });

    it('should open dialog and not dispatch if not confirmed', () => {
      const rowData = {
        status: 'AVAILABLE',
        promo_code_unicode_quota_allocation_detail_id: 1,
        type: 'SOME_TYPE',
        created_by: 'admin',
      } as any;
      const afterClosed$ = of(false);
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => afterClosed$,
      } as any);

      component.markAsRedeem(rowData);

      expect(dispatchSpy).not.toHaveBeenCalledWith({
        type: ManualCodeRedemptionActions.updateManualCodeRedemptionStatus.type,
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch resetAll on ngOnDestroy', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(
        ManualCodeRedemptionActions.resetAll()
      );
    });
  });
});
