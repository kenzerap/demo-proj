import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointRuleListFilterComponent } from './point-rule-list-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as PointRuleListActions from '../../stores/point-rule-list/point-rule-list.actions';
import * as PointRuleSelectors from '../../stores/point-rule-list/point-rule-list.selectors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('PointRuleListFilterComponent', () => {
  let component: PointRuleListFilterComponent;
  let fixture: ComponentFixture<PointRuleListFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PointRuleListFilterComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: PointRuleSelectors.selectPointRuleFilters,
              value: { keyword: 'test-keyword' },
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PointRuleListFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.searchForm.value).toEqual({
      commonSearch: 'test-keyword',
    });
  });

  it('should patch form value when selectCommonSearch$ emits', () => {
    const newKeyword = 'new-keyword';
    (store.overrideSelector as any)(PointRuleSelectors.selectPointRuleFilters, {
      keyword: newKeyword,
    });
    component.selectCommonSearch$ = of(newKeyword);
    component.ngOnInit();
    expect(component.searchForm.value).toEqual({ commonSearch: newKeyword });
  });

  it('should dispatch setPointRuleFilters action on onSearch', () => {
    component.searchForm.setValue({
      commonSearch: 'search value',
    });

    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      PointRuleListActions.setPointRuleFilters({
        filters: {
          keyword: 'search value',
          page: 0,
        },
      })
    );
  });

  it('should trim spaces in keyword on onSearch', () => {
    component.searchForm.setValue({
      commonSearch: '  spaced value  ',
    });

    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      PointRuleListActions.setPointRuleFilters({
        filters: {
          keyword: 'spaced value',
          page: 0,
        },
      })
    );
  });

  it('should reset the form and call onSearch on resetForm', () => {
    jest.spyOn(component, 'onSearch');
    component.searchForm.setValue({
      commonSearch: 'test search',
    });

    component.resetForm();

    expect(component.searchForm.value).toEqual({
      commonSearch: null,
    });
    expect(component.onSearch).toHaveBeenCalled();
  });
});
