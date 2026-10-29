import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedeemHistoryComponent } from './redeem-history.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import * as redeemHistorySelectors from '../../stores/redeem-history/redeem-history.selectors';
import * as RedeemHistoryActions from '../../stores/redeem-history/redeem-history.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { RedeemType } from '@app/shared/utils/enums/redeem-type.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RedeemHistoryComponent', () => {
  let component: RedeemHistoryComponent;
  let fixture: ComponentFixture<RedeemHistoryComponent>;
  let store: MockStore;
  let activatedRoute: ActivatedRoute;

  const mockRedeemHistories = [
    { id: 1, redeemType: RedeemType.PROMOCODE, promoCodeCode: 'PROMO123' },
    { id: 2, redeemType: RedeemType.UNICODE, uniCodeCode: 'UNI456' },
  ];

  const mockPagination = {
    page: 0,
    size: 20,
    totalItems: 2,
    totalPages: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedeemHistoryComponent],
      providers: [
        provideMockStore({
          initialState: {
            redeemHistory: {
              redeemHistories: mockRedeemHistories,
              pagination: mockPagination,
            },
          },
          selectors: [
            {
              selector: redeemHistorySelectors.selectRedeemHistories,
              value: mockRedeemHistories,
            },
            {
              selector: redeemHistorySelectors.selectPagination,
              value: mockPagination,
            },
            {
              selector: selectIsLoading('getRedeemHistories'),
              value: false,
            },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ party_id: '456' }),
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RedeemHistoryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize partyId from route params', () => {
    expect(component.partyId()).toBe('456');
  });

  it('should select pagination$ from the store', (done) => {
    component.pagination$.subscribe((pagination) => {
      expect(pagination).toEqual(mockPagination);
      done();
    });
  });

  it('should dispatch getRedeemHistories on initialization', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        RedeemHistoryActions.getRedeemHistories({
          partyId: '456',
          queryParams: { page: 0, size: 20 },
        })
      );
    }, 0);
  });

  it('should update defaultParams and dispatch getRedeemHistories on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(component.defaultParams()).toEqual({ page: 2, size: 20 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      RedeemHistoryActions.getRedeemHistories({
        partyId: '456',
        queryParams: { page: 2, size: 20 },
      })
    );
  });

  it('should update defaultParams and dispatch getRedeemHistories on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(50);
    expect(component.defaultParams()).toEqual({ page: 0, size: 50 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      RedeemHistoryActions.getRedeemHistories({
        partyId: '456',
        queryParams: { page: 0, size: 50 },
      })
    );
  });
});
