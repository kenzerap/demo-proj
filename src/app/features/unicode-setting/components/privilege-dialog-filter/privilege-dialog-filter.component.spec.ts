import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivilegeDialogFilterComponent } from './privilege-dialog-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as CreateEditUnicodeActions from '../../stores/create-edit-unicode/create-edit-unicode.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrivilegeDialogFilterComponent', () => {
  let component: PrivilegeDialogFilterComponent;
  let fixture: ComponentFixture<PrivilegeDialogFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PrivilegeDialogFilterComponent,
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

    fixture = TestBed.createComponent(PrivilegeDialogFilterComponent);
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

  it('should dispatch setPrivilegeSearchFilter action on onSearch', () => {
    component.searchForm.setValue({
      commonSearch: 'test search',
    });

    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      CreateEditUnicodeActions.setPrivilegeSearchFilter({
        filters: { keyword: 'test search' },
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
