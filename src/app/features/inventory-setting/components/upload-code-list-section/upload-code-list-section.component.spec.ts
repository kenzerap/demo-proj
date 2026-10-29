import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadCodeListSectionComponent } from './upload-code-list-section.component';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';
import * as CreateEditInventoryActions from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.actions';
import * as CreateEditInventorySelectors from '@app/features/inventory-setting/stores/create-edit-inventory/create-edit-inventory.selectors';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { InventoryWarningDialogComponent } from '../inventory-warning-dialog/inventory-warning-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UploadCodeDialogComponent } from '../upload-code-dialog/upload-code-dialog.component';
import { UploadCode } from '../../models/upload-code.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

describe('UploadCodeListSectionComponent', () => {
  let component: UploadCodeListSectionComponent;
  let fixture: ComponentFixture<UploadCodeListSectionComponent>;
  let store: MockStore;
  let datePipe: DatePipe;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        UploadCodeListSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        DatePipe,
        provideMockStore({
          selectors: [
            {
              selector: CreateEditInventorySelectors.selectUploadCodes,
              value: of([{ upload_code_id: 1, code: 'Test Code' }]),
            },
          ],
        }),
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadCodeListSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    datePipe = TestBed.inject(DatePipe);

    component.formGroup = new FormBuilder().group({
      inventory_name: ['Test Inventory'],
      description: ['Test Description'],
      brand_id: [1],
      inventory_type: ['TYPE'],
      status: [true],
      expire_date: ['2023-10-01'],
      expire_time: [datePipe.transform('2023-10-01T03:00:00.000Z', 'HH:mm')],
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tableColumns and uploadCodes$', () => {
    expect(component.tableColumns()).toBeDefined();
    component.uploadCodes$.subscribe((uploadCodes) => {
      expect(uploadCodes).toEqual([
        {
          upload_code_id: 1,
          code_name: 'Test Code',
          description: '',
          quantity: 0,
          created_date: '',
          created_by: '',
        },
      ]);
    });
  });

  it('should handle deleteUploadCodeSuccess action', () => {
    actions$.next(
      CreateEditInventoryActions.deleteUploadCodeSuccess({
        response: {
          deleted: false,
          linked_privileges: [
            { privilege_id: 1, name_th: 'Privilege 1', name_en: 'Privilege 1' },
          ],
          upload_code_list: [],
        },
        inventory_id: 1,
      })
    );

    expect(mockDialog.open).toHaveBeenCalledWith(
      InventoryWarningDialogComponent,
      {
        data: {
          linkedPrivileges: [
            { privilege_id: 1, name_th: 'Privilege 1', name_en: 'Privilege 1' },
          ],
          message:
            'This code is currently linked to an active privilege. To proceed with deletion, please deactivate the associated privilege first.',
          title: "The code can't delete",
        },
        autoFocus: false,
        width: '30rem',
      }
    );

    actions$.next(
      CreateEditInventoryActions.deleteUploadCodeSuccess({
        response: {
          deleted: true,
          linked_privileges: [
            { privilege_id: 1, name_th: 'Privilege 1', name_en: 'Privilege 1' },
          ],
          upload_code_list: [],
        },
        inventory_id: 1,
      })
    );

    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        message: 'The inventory stocks was updated',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'success',
      },
      width: '25rem',
    });
  });

  it('should open the upload code dialog', () => {
    component.openUploadCodeDialog();

    expect(mockDialog.open).toHaveBeenCalledWith(UploadCodeDialogComponent, {
      data: {
        inventoryData: {
          inventory_name: 'Test Inventory',
          description: 'Test Description',
          brand_id: 1,
          inventory_type: 'TYPE',
          status: 'ACTIVE',
          expire_date_time: '2023-10-01T03:00:00.000Z',
        },
      },
      width: '36rem',
      autoFocus: false,
      disableClose: true,
    });
  });

  it('should open confirmation dialog and dispatch deleteUploadCode', () => {
    const rowData: UploadCode = {
      upload_code_id: 1,
      code_name: 'Test Code',
      description: '',
      quantity: 0,
      created_date: '',
      created_by: '',
    };
    component.deleteUploadCode(rowData);

    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'Delete Codes?',
        message: `If you confirm, the system will immediately delete these codes from the database.`,
        btnCloseText: 'Cancel',
        btnConfirmText: 'Confirm',
        type: 'warning',
      },
      width: '25rem',
    });

    mockDialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          expect(store.dispatch).toHaveBeenCalledWith(
            CreateEditInventoryActions.deleteUploadCode({ upload_code_id: 1 })
          );
        }
      });
  });
});
