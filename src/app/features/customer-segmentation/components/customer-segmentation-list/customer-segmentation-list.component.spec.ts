import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerSegmentationListComponent } from './customer-segmentation-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import * as CustomerSegmentationActions from '../../stores/customer-segmentation/customer-segmentation.actions';
import * as CustomerSegmentationOrderActions from '../../stores/reorder-list/reorder-list.actions';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
import { StatusCode } from '@app/shared/utils/enums/status-code.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerSegmentationTable } from '../../models/customer-segmentation.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomerSegmentationListComponent', () => {
  let component: CustomerSegmentationListComponent;
  let fixture: ComponentFixture<CustomerSegmentationListComponent>;
  let store: MockStore;
  let dialog: jest.Mocked<MatDialog>;
  let router: jest.Mocked<Router>;
  let actions$: ReplaySubject<any> = new ReplaySubject(1);

  beforeEach(async () => {
    dialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [CustomerSegmentationListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerSegmentationListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setCustomerSegmentationsFilter on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CustomerSegmentationActions.setCustomerSegmentationsFilter({
        filters: { page: 0 },
      })
    );
  });

  it('should open confirm dialog and dispatch reOrderCustomerSegmentations on publishItems', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.publishItems();
    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'You want to publish changes?',
        message: `The updated order will immediately affect customer-facing views. Please confirm to apply changes or cancel to continue editing.`,
        btnConfirmText: 'Confirm',
        btnCloseText: 'Cancel',
        type: 'warning',
      },
      width: '25rem',
    });
    expect(dispatchSpy).toHaveBeenCalledWith(
      CustomerSegmentationOrderActions.reOrderCustomerSegmentations()
    );
  });

  it('should handle cancelEditOrder with unsaved changes', () => {
    jest.spyOn(component, 'isOrderDirty').mockReturnValue(true);
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.cancelEditOrder();
    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'Discard Changes?',
        message: `You have unsaved changes. If you cancel now, your changes will not be saved. Do you want to continue?`,
        btnConfirmText: 'Discard',
        btnCloseText: 'Cancel',
        type: 'warning',
      },
      width: '25rem',
    });
  });

  it('should handle cancelEditOrder without unsaved changes', () => {
    jest.spyOn(component, 'isOrderDirty').mockReturnValue(false);
    const setEditOrderSpy = jest.spyOn(component, 'setEditOrder');
    component.cancelEditOrder();
    expect(setEditOrderSpy).toHaveBeenCalledWith(false);
  });

  it('should navigate to createCustomerSegment', () => {
    component.createCustomerSegment();
    expect(router.navigate).toHaveBeenCalledWith([
      'user-management',
      'customer-segmentation',
      'form',
      'create',
    ]);
  });

  it('should dispatch setCustomerSegmentationsFilter on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CustomerSegmentationActions.setCustomerSegmentationsFilter({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setCustomerSegmentationsFilter on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(10);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CustomerSegmentationActions.setCustomerSegmentationsFilter({
        filters: { size: 10, page: 0 },
      })
    );
  });

  it('should dispatch updateCustomerSegmentationsOrder on onDragDropChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event: DragDropChange<any> = {
      data: [
        { id: 1, status: StatusCode.ACTIVE, priority: 1 },
        { id: 2, status: StatusCode.ACTIVE, priority: 2 },
      ],
    } as any;
    component.onDragDropChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CustomerSegmentationOrderActions.updateCustomerSegmentationsOrder({
        newList: event.data,
      })
    );
  });

  it('should dispatch updatePublishedStatus on onToggleChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const rowData = {
      id: 1,
      is_published: true,
    } as CustomerSegmentationTable;
    component.onToggleChange({ checked: false } as any, rowData);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CustomerSegmentationOrderActions.updatePublishedStatus({
        id: 1,
        is_published: false,
      })
    );
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CustomerSegmentationActions.resetAll()
    );
  });
});
