import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimHistoryComponent } from './claim-history.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import * as claimHistoryActions from '../../stores/claim-history/claim-history.actions';
import { Policy } from '../../models/policy.model';
import { claimHistoryColumns } from '../../constants/claim-history-columns.const';
import { PolicyTypeCode } from '@app/shared/utils/enums/policy-type.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ClaimHistoryComponent', () => {
  let component: ClaimHistoryComponent;
  let fixture: ComponentFixture<ClaimHistoryComponent>;
  let store: MockStore;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimHistoryComponent],
      providers: [
        provideMockStore(),
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

    fixture = TestBed.createComponent(ClaimHistoryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.policy = mockPolicy;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize partyId from route params', () => {
    expect(component.partyId()).toBe('123');
  });

  it('should dispatch getClaimHistories on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      claimHistoryActions.getClaimHistories({
        partyId: '123',
        policyId: 1,
        queryParams: { page: 0, size: 5 },
      })
    );
  });

  it('should update defaultParams and dispatch getClaimHistories on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(component.defaultParams()).toEqual({ page: 2, size: 5 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      claimHistoryActions.getClaimHistories({
        partyId: '123',
        policyId: 1,
        queryParams: { page: 2, size: 5 },
      })
    );
  });

  it('should update defaultParams and dispatch getClaimHistories on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(10);
    expect(component.defaultParams()).toEqual({ page: 0, size: 10 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      claimHistoryActions.getClaimHistories({
        partyId: '123',
        policyId: 1,
        queryParams: { page: 0, size: 10 },
      })
    );
  });

  it('should have the correct table columns', () => {
    expect(component.tableColumns()).toBe(claimHistoryColumns);
  });
});
