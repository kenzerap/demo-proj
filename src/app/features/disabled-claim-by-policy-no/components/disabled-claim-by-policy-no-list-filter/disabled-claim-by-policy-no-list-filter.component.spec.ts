import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisabledClaimByPolicyNoListFilterComponent } from './disabled-claim-by-policy-no-list-filter.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as DisabledClaimByPolicyNoListActions from '../../stores/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DisabledClaimByPolicyNoListFilterComponent', () => {
  let component: DisabledClaimByPolicyNoListFilterComponent;
  let fixture: ComponentFixture<DisabledClaimByPolicyNoListFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DisabledClaimByPolicyNoListFilterComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DisabledClaimByPolicyNoListFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise searchForm with empty commonSearch', () => {
    expect(component.searchForm.value).toEqual({ commonSearch: '' });
  });

  it('should dispatch setDisabledClaimPolicyFilters with trimmed keyword on onSearch', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.searchForm.setValue({ commonSearch: '  policy123  ' });

    component.onSearch();

    expect(dispatchSpy).toHaveBeenCalledWith(
      DisabledClaimByPolicyNoListActions.setDisabledClaimPolicyFilters({
        filters: { keyword: 'policy123', page: 0 },
      }),
    );
  });

  it('should dispatch setDisabledClaimPolicyFilters with empty keyword when commonSearch is null', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.searchForm.setValue({ commonSearch: null });

    component.onSearch();

    expect(dispatchSpy).toHaveBeenCalledWith(
      DisabledClaimByPolicyNoListActions.setDisabledClaimPolicyFilters({
        filters: { keyword: '', page: 0 },
      }),
    );
  });

  it('should reset form and call onSearch on resetForm', () => {
    const onSearchSpy = jest.spyOn(component, 'onSearch');
    component.searchForm.setValue({ commonSearch: 'something' });

    component.resetForm();

    expect(component.searchForm.value).toEqual({ commonSearch: null });
    expect(onSearchSpy).toHaveBeenCalled();
  });
});
