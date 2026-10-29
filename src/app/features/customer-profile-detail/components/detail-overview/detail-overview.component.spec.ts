import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailOverviewComponent } from './detail-overview.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import * as fromAnalyticSummaryActions from '../../stores/analytic-summary/analytic-summary.actions';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import { CustomerType } from 'src/app/shared/utils/enums/customer-type.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Actions } from '@ngrx/effects';

describe('DetailOverviewComponent', () => {
  let component: DetailOverviewComponent;
  let fixture: ComponentFixture<DetailOverviewComponent>;
  let store: MockStore;
  let activatedRoute: any;
  let dispatchSpy: jest.SpyInstance;
  let destroy$: Subject<void>;

  beforeEach(async () => {
    destroy$ = new Subject<void>();
    activatedRoute = { parent: { params: of({ party_id: '12345' }) } };

    await TestBed.configureTestingModule({
      imports: [DetailOverviewComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: fromAnalyticSummarySelectors.selectCustomerPolicy,
              value: { customer_type: CustomerType.INSURED },
            },
          ],
        }),
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Actions, useValue: of() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DetailOverviewComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getAnalyticSummary action when party_id is available', () => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        fromAnalyticSummaryActions.getAnalyticSummary({ partyId: '12345' })
      );
    }, 0);
  });

  it('should set customerType$ observable correctly', (done) => {
    component.customerType$.subscribe((customerType) => {
      expect(customerType).toEqual(CustomerType.INSURED);
      done();
    });
  });

  it('should dispatch reset action on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      fromAnalyticSummaryActions.reset()
    );
  });
});
