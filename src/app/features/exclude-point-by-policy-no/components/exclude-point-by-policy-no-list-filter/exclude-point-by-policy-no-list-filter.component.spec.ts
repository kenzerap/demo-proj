import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExcludePointByPolicyNoListFilterComponent } from './exclude-point-by-policy-no-list-filter.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as ExcludePointByPolicyNoListActions from '../../stores/exclude-point-by-policy-no-list/exclude-point-by-policy-no-list.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ExcludePointByPolicyNoListFilterComponent', () => {
  let component: ExcludePointByPolicyNoListFilterComponent;
  let fixture: ComponentFixture<ExcludePointByPolicyNoListFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ExcludePointByPolicyNoListFilterComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcludePointByPolicyNoListFilterComponent);
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

  it('should dispatch setExcludePointPolicyFilters with trimmed keyword on onSearch', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.searchForm.setValue({ commonSearch: '  policy123  ' });

    component.onSearch();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoListActions.setExcludePointPolicyFilters({
        filters: { keyword: 'policy123', page: 0 },
      }),
    );
  });

  it('should dispatch setExcludePointPolicyFilters with empty keyword when commonSearch is null', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.searchForm.setValue({ commonSearch: null });

    component.onSearch();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ExcludePointByPolicyNoListActions.setExcludePointPolicyFilters({
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
