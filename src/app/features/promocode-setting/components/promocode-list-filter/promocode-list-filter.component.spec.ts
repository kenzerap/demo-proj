import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromocodeListFilterComponent } from './promocode-list-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as PromocodeListActions from '../../stores/promocode-list/promocode-list.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PromocodeListFilterComponent', () => {
  let component: PromocodeListFilterComponent;
  let fixture: ComponentFixture<PromocodeListFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PromocodeListFilterComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PromocodeListFilterComponent);
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
      commonSearch: '',
    });
  });

  it('should dispatch setPromoCodeFilters action on onSearch', () => {
    component.searchForm.setValue({
      commonSearch: 'test search',
    });

    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      PromocodeListActions.setPromoCodeFilters({
        filters: {
          keyword: 'test search',
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
