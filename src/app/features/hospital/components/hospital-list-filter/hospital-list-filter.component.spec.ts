import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospitalListFilterComponent } from './hospital-list-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as HospitalActions from '../../stores/hospital-list/hospital-list.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HospitalListFilterComponent', () => {
  let component: HospitalListFilterComponent;
  let fixture: ComponentFixture<HospitalListFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HospitalListFilterComponent,
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

    fixture = TestBed.createComponent(HospitalListFilterComponent);
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

  it('should dispatch setHospitalFilters action on onSearch', () => {
    component.searchForm.setValue({
      commonSearch: 'test search',
    });

    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      HospitalActions.setHospitalFilters({
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
