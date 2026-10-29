import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointHistoryComponent } from './point-history.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import * as fromAnalyticSummaryActions from '../../stores/analytic-summary/analytic-summary.actions';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import { DeletePointComponent } from '../delete-point/delete-point.component';
import { AddPointComponent } from '../add-point/add-point.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PointHistoryComponent', () => {
  let component: PointHistoryComponent;
  let fixture: ComponentFixture<PointHistoryComponent>;
  let store: MockStore;
  let dialog: jest.Mocked<MatDialog>;
  let router: jest.Mocked<Router>;
  let activatedRoute: ActivatedRoute;
  const destroy$ = new Subject<void>();

  beforeEach(async () => {
    dialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    router = {
      navigate: jest.fn(),
      events: of(new NavigationEnd(1, '/point-history', '/point-history')),
    } as unknown as jest.Mocked<Router>;

    activatedRoute = {
      parent: {
        params: of({ party_id: '123' }),
      },
      firstChild: {
        snapshot: { url: [{ path: 'tab1' }] },
        firstChild: null,
      },
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [PointHistoryComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: fromAnalyticSummarySelectors.selectCustomerPoint,
              value: of(null),
            },
          ],
        }),
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PointHistoryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize partyId and dispatch getCustomerPoint on initialization', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    expect(component.partyId()).toBe('123');

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        fromAnalyticSummaryActions.getCustomerPoint({ partyId: '123' })
      );
    }, 0);
  });

  it('should set activeTabUrl on router NavigationEnd event', () => {
    component.getActiveTabUrl();
    expect(component.activeTabUrl()).toBe('tab1');
  });

  it('should navigate to the correct tab on changeTab', () => {
    component.changeTab('tab2');
    expect(router.navigate).toHaveBeenCalledWith(['tab2'], {
      relativeTo: activatedRoute,
    });
  });

  it('should open AddPoint dialog with correct data', () => {
    component.openAddPointDialog();
    expect(dialog.open).toHaveBeenCalledWith(AddPointComponent, {
      data: { partyId: '123' },
      autoFocus: false,
      width: '35rem',
    });
  });

  it('should open DeletePoint dialog with correct data', () => {
    component.openDeletePointDialog();
    expect(dialog.open).toHaveBeenCalledWith(DeletePointComponent, {
      data: { partyId: '123' },
      autoFocus: false,
      width: '35rem',
    });
  });

  it('should dispatch reset action on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      fromAnalyticSummaryActions.reset()
    );
  });
});
