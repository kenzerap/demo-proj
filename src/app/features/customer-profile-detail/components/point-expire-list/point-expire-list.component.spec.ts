import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointExpireListComponent } from './point-expire-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import * as PointHistoryActions from '../../stores/point-history/point-history.actions';
import { NO_ERRORS_SCHEMA, WritableSignal } from '@angular/core';

describe('PointExpireListComponent', () => {
  let component: PointExpireListComponent;
  let fixture: ComponentFixture<PointExpireListComponent>;
  let store: MockStore;
  let activatedRoute: ActivatedRoute;
  const destroy$ = new Subject<void>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointExpireListComponent],
      providers: [
        provideMockStore(),
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

    fixture = TestBed.createComponent(PointExpireListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jest
      .spyOn(component['destroy$'], 'complete')
      .mockImplementation(() => destroy$.complete());
    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize partyId and dispatch getPointExpiries on initialization', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    expect(component.partyId()).toBe('123');

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        PointHistoryActions.getPointExpiries({
          partyId: '123',
          queryParams: { page: 0, size: 10 },
        })
      );
    }, 0);
  });

  it('should update defaultParams and dispatch getPointExpiries on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(component.defaultParams()).toEqual({ page: 2, size: 10 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      PointHistoryActions.getPointExpiries({
        partyId: '123',
        queryParams: { page: 2, size: 10 },
      })
    );
  });

  it('should update defaultParams and dispatch getPointExpiries on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(20);
    expect(component.defaultParams()).toEqual({ page: 0, size: 20 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      PointHistoryActions.getPointExpiries({
        partyId: '123',
        queryParams: { page: 0, size: 20 },
      })
    );
  });

  it('should dispatch resetPointExpiries on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      PointHistoryActions.resetPointExpiries()
    );
  });
});
