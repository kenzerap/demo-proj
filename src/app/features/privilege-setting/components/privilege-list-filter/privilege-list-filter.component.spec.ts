import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivilegeListFilterComponent } from './privilege-list-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as PrivilegeListActions from '../../stores/privilege/privilege.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrivilegeListFilterComponent', () => {
  let component: PrivilegeListFilterComponent;
  let fixture: ComponentFixture<PrivilegeListFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PrivilegeListFilterComponent,
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

    fixture = TestBed.createComponent(PrivilegeListFilterComponent);
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
      privilegeId: '',
    });
  });

  it('should dispatch setPrivilegeSettingsFilter action on onSearch', () => {
    component.searchForm.setValue({
      commonSearch: 'test search',
      privilegeId: 'P001',
    });

    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      PrivilegeListActions.setPrivilegeSettingsFilter({
        filters: {
          keyword: 'test search',
          privilegeId: 'P001',
          page: 0,
        },
      })
    );
  });

  it('should reset the form and call onSearch on resetForm', () => {
    jest.spyOn(component, 'onSearch');
    component.searchForm.setValue({
      commonSearch: 'test search',
      privilegeId: 'P001',
    });

    component.resetForm();

    expect(component.searchForm.value).toEqual({
      commonSearch: null,
      privilegeId: null,
    });
    expect(component.onSearch).toHaveBeenCalled();
  });
});
