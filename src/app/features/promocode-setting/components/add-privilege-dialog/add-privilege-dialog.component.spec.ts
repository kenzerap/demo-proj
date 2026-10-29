import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPrivilegeDialogComponent } from './add-privilege-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as CreateEditPromocodeSelectors from '@app/features/promocode-setting/stores/create-edit-promocode/create-edit-promocode.selectors';
import { Privilege } from '@app/shared/models/privilege.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddPrivilegeDialogComponent', () => {
  let component: AddPrivilegeDialogComponent;
  let fixture: ComponentFixture<AddPrivilegeDialogComponent>;
  let store: MockStore;
  let dialogRef: jest.Mocked<MatDialogRef<AddPrivilegeDialogComponent>>;

  const mockDialogData = {
    privilege: { privilegeId: 1, privilegeName: 'Test Privilege' } as Privilege,
  };

  const mockPrivileges = [
    { privilegeId: 1, privilegeName: 'Test Privilege' },
    { privilegeId: 2, privilegeName: 'Another Privilege' },
  ] as Privilege[];

  beforeEach(async () => {
    dialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<AddPrivilegeDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [AddPrivilegeDialogComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CreateEditPromocodeSelectors.selectPrivileges,
              value: mockPrivileges,
            },
            {
              selector: CreateEditPromocodeSelectors.selectFilteredPrivileges,
              value: mockPrivileges,
            },
          ],
        }),
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPrivilegeDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize privileges and set selectedItem on ngOnInit', () => {
    expect(component.privileges).toEqual(mockPrivileges);
    expect(component.selectedItem()).toEqual(mockPrivileges[0]);
  });

  it('should close the dialog with selected item on onSubmit', () => {
    component.selectedItem.set(mockPrivileges[1]);
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({
      selectedItem: mockPrivileges[1],
    });
  });

  it('should close the dialog without data on onCancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should update selectedItem on onSelectedItemsChange', () => {
    const newSelectedItem = mockPrivileges[1];
    component.onSelectedItemsChange({
      items: [newSelectedItem],
      toggleItem: newSelectedItem,
    });
    expect(component.selectedItem()).toEqual(newSelectedItem);
  });

  it('should not close the dialog on onSubmit if no selectedItem', () => {
    component.selectedItem.set(null);
    component.onSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
