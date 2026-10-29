import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyPolicyListComponent } from './family-policy-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import { Policy } from '../../models/policy.model';
import { PolicyTypeCode } from '@app/shared/utils/enums/policy-type.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FamilyPolicyListComponent', () => {
  let component: FamilyPolicyListComponent;
  let fixture: ComponentFixture<FamilyPolicyListComponent>;
  let store: MockStore;

  const mockPolicies: Policy[] = [
    {
      policy_id: 1,
      policy_no: 'P-12345',
      policy_status: 'Active',
      policy_holder: 'John Doe',
      system_id: PolicyTypeCode.GROUP,
      product_name: 'Health Insurance',
      client_cert_no: 'C-12345',
      insured_name: 'John Doe',
      premium_amount: 1000,
      sum_insured_amount: 50000,
      show_payment: true,
      paid_to_date: '2023-12-31',
      last_policy_status: 'Active',
    },
    {
      policy_id: 2,
      policy_no: 'P-67890',
      policy_status: 'Inactive',
      policy_holder: 'Jane Smith',
      system_id: PolicyTypeCode.GROUP,
      product_name: 'Life Insurance',
      client_cert_no: 'C-67890',
      insured_name: 'Jane Smith',
      premium_amount: 1500,
      sum_insured_amount: 100000,
      show_payment: false,
      paid_to_date: '2023-11-30',
      last_policy_status: 'Inactive',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyPolicyListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: fromAnalyticSummarySelectors.selectFamilyPolicies,
              value: mockPolicies,
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(FamilyPolicyListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display family policies', (done) => {
    component.familyPolicies$.subscribe((policies) => {
      expect(policies).toEqual(mockPolicies);
      done();
    });
  });

  it('should set expansion status correctly', () => {
    component.setExpansionStatus(1, true);
    expect(component.expansionStatus()[1]).toBe(true);

    component.setExpansionStatus(1, false);
    expect(component.expansionStatus()[1]).toBe(false);
  });

  it('should return correct noDataMessage', () => {
    expect(component.noDataMessage).toEqual({
      imgUrl: 'telescope.svg',
      title: `User don't have any dependent's policy.`,
      subTitle: `User dependent's policy will appear here.`,
    });
  });
});
