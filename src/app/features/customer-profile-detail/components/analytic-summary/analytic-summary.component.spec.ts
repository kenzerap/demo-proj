import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AnalyticSummaryComponent } from './analytic-summary.component';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import { PolicyType } from 'src/app/shared/utils/enums/policy-type.enum';
import { CustomerPolicy } from '../../models/customer-policy.model';
import { CustomerPoint } from '../../models/customer-point.model';
import { CustomerType } from '@app/shared/utils/enums/customer-type.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomerTier } from '../../models/cutomer-tier.model';

describe('AnalyticSummaryComponent', () => {
  let component: AnalyticSummaryComponent;
  let store: MockStore;

  const initialState = {
    analyticSummary: {
      customerPolicy: null,
      customerPoint: null,
      customerTier: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnalyticSummaryComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    });

    store = TestBed.inject(MockStore);
    component = TestBed.createComponent(
      AnalyticSummaryComponent
    ).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct policyType enum', () => {
    expect(component.policyType).toEqual(PolicyType);
  });

  it('should select analyticSummary$ from the store', (done) => {
    const mockAnalyticSummary: {
      customerPolicy: CustomerPolicy | null;
      customerPoint: CustomerPoint | null;
      customerTier: CustomerTier | null;
    } = {
      customerPolicy: {
        customer_type: CustomerType.INSURED,
        policy_types: [PolicyType.GROUP, PolicyType.NON_LIFE],
        individual_cnt: 5,
        group_cnt: 3,
        all_policies_output: {
          owner_policies: [],
          family_policies: [],
        },
      },
      customerPoint: {
        total_points: 100,
        expiring_date: '2023-12-31',
        expiring_total_points: 50,
      },
      customerTier: {
        user_tier_id: 39,
        tier_id: '17',
        tier_color: '#30a96c',
        tier_name_english: 'Test Tier',
        tier_name_thai: 'ทดสอบ Tier',
      },
    };

    store.overrideSelector(
      fromAnalyticSummarySelectors.selectAnalyticSummary,
      mockAnalyticSummary
    );

    component.analyticSummary$.subscribe((value) => {
      expect(value).toEqual(mockAnalyticSummary);
      done();
    });
  });
});
