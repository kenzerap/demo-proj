import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyListComponent } from './policy-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as fromPolicyDetailActions from '../../stores/policy-detail/policy-detail.actions';
import * as claimHistoryActions from '../../stores/claim-history/claim-history.actions';
import * as eClaimSubmitActions from '../../stores/e-claim-submit/e-claim-submit.actions';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PolicyListComponent', () => {
  let component: PolicyListComponent;
  let fixture: ComponentFixture<PolicyListComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: fromAnalyticSummarySelectors.selectOwnerPolicies,
              value: [{ policy_id: 1, policy_no: 'P-123' }],
            },
            {
              selector: selectIsLoading('getAnalyticSummary'),
              value: false,
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set expansion status correctly', () => {
    component.setExpansionStatus(1, true);
    expect(component.expansionStatus()).toEqual({ 1: true });

    component.setExpansionStatus(1, false);
    expect(component.expansionStatus()).toEqual({ 1: false });
  });

  it('should dispatch reset actions on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(fromPolicyDetailActions.reset());
    expect(dispatchSpy).toHaveBeenCalledWith(claimHistoryActions.reset());
    expect(dispatchSpy).toHaveBeenCalledWith(eClaimSubmitActions.reset());
  });

  it('should select ownerPolicies$ from the store', (done) => {
    component.ownerPolicies$.subscribe((policies) => {
      expect(policies).toEqual([{ policy_id: 1, policy_no: 'P-123' } as any]);
      done();
    });
  });
});
