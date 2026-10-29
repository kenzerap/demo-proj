import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyDetailComponent } from './policy-detail.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import * as fromPolicyDetailActions from '../../stores/policy-detail/policy-detail.actions';
import * as fromPolicyDetailSelectors from '../../stores/policy-detail/policy-detail.selectors';
import { PolicyTypeCode } from 'src/app/shared/utils/enums/policy-type.enum';
import { Policy, PolicyDetail } from '../../models/policy.model';
import {
  policyDetailDefaultColumns,
  policyDetailGroupColumns,
} from '../../constants/policy-detail-columns.const';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PolicyDetailComponent', () => {
  let component: PolicyDetailComponent;
  let fixture: ComponentFixture<PolicyDetailComponent>;
  let store: MockStore;
  let activatedRoute: ActivatedRoute;

  const mockPolicy: Policy = {
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
  };

  const policyDetail: PolicyDetail = {
    policy_id: 1,
    policy_no: 'P-12345',
    policy_status: 'Active',
    insured_name: 'John Doe',
    policy_sum_insured_amount: 50000,
    policy_effect_date: '2023-01-01',
    policy_expired_date: '2024-01-01',
    premium_payment_period: 'Monthly',
    address: '123 Main St, City, Country',
    system: 'System A',
    system_id: PolicyTypeCode.GROUP,
    client_cert_no: 'C-12345',
    policy_holder: 'John Doe',
    product_type: 'Health Insurance',
    policy_payer_name: 'John Doe',
    premium_amount: 1000,
    premium_term: '1 Year',
    billing_frequency_code: 'Monthly',
    coverage_term: '1 Year',
    client_no: 'C-12345',
    product_name: 'Health Insurance',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyDetailComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: fromPolicyDetailSelectors.selectPolicyDetailByPolicyId(
                mockPolicy.policy_id
              ),
              value: policyDetail,
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
              params: of({ party_id: '123' }),
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    activatedRoute = TestBed.inject(ActivatedRoute);
    component.policy = mockPolicy;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize partyId from route params', () => {
    expect(component.partyId()).toBe('123');
  });

  it('should dispatch getPolicyDetail on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      fromPolicyDetailActions.getPolicyDetail({
        partyId: '123',
        policyId: 1,
      })
    );
  });

  it('should compute tableColumns based on policy type', () => {
    expect(component.tableColumns()).toEqual(policyDetailGroupColumns);
    component.policy.system_id = PolicyTypeCode.LIFE;

    setTimeout(() => {
      expect(component.tableColumns()).toEqual(policyDetailDefaultColumns);
    }, 0);
  });

  it('should unsubscribe on destroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
