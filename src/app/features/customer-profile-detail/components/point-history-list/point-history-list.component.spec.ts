import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointHistoryListComponent } from './point-history-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import * as PointHistoryActions from '../../stores/point-history/point-history.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PointHistoryListComponent', () => {
  let component: PointHistoryListComponent;
  let fixture: ComponentFixture<PointHistoryListComponent>;
  let store: MockStore;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointHistoryListComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: 'selectPointHistories',
              value: of([]),
            },
            {
              selector: 'selectPointHistoriesPagination',
              value: of({ page: 0, size: 10, totalItems: 0, totalPages: 0 }),
            },
            {
              selector: 'selectIsLoading',
              value: of(false),
            },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              parent: {
                params: of({ party_id: '123' }),
              },
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PointHistoryListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize partyId and dispatch getPointHistories on initialization', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    expect(component.partyId()).toBe('123');

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        PointHistoryActions.getPointHistories({
          partyId: '123',
          queryParams: { page: 0, size: 10 },
        })
      );
    }, 0);
  });

  it('should update defaultParams and dispatch getPointHistories on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(component.defaultParams()).toEqual({ page: 2, size: 10 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      PointHistoryActions.getPointHistories({
        partyId: '123',
        queryParams: { page: 2, size: 10 },
      })
    );
  });

  it('should update defaultParams and dispatch getPointHistories on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(20);
    expect(component.defaultParams()).toEqual({ page: 0, size: 20 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      PointHistoryActions.getPointHistories({
        partyId: '123',
        queryParams: { page: 0, size: 20 },
      })
    );
  });

  it('should dispatch resetPointHistories on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      PointHistoryActions.resetPointHistories()
    );
  });
});
