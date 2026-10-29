import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, ReplaySubject, Subject } from 'rxjs';
import { HomeScreenManagementListComponent } from './home-screen-management-list.component';
import * as HomeScreenManagementActions from '../../stores/home-screen-management-list/home-screen-management-list.actions';
import * as HomeScreenManagementOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as HomeScreenManagementOrderSelector from '../../stores/reorder-list/reorder-list.selectors';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { HomeScreenManagement } from '../../models/home-screen-management.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { provideMockActions } from '@ngrx/effects/testing';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

describe('HomeScreenManagementListComponent', () => {
  let component: HomeScreenManagementListComponent;
  let fixture: ComponentFixture<HomeScreenManagementListComponent>;
  let store: MockStore;
  let dialog: any;
  let router: any;
  let hasPermissionService: any;
  let actions$: ReplaySubject<any>;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    dialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    };
    router = {
      navigate: jest.fn(),
    };
    hasPermissionService = {
      hasPermission: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [HomeScreenManagementListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: HomeScreenManagementOrderSelector.selectIsOrderDirty,
              value: false,
            },
          ],
        }),
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router },
        { provide: HasPermissionService, useValue: hasPermissionService },
        provideMockActions(() => actions$),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeScreenManagementListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setHomeScreenManagementFilters on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementActions.setHomeScreenManagementFilters({
        filters: { page: 0, size: 20 },
      })
    );
  });

  it('should update isOrderDirty signal on isOrderDirty$ change', () => {
    component.isOrderDirty$.subscribe((isDirty) => {
      component.isOrderDirty.set(isDirty);
      expect(component.isOrderDirty()).toBe(false);
    });
  });

  it('should dispatch setHomeScreenManagementFilters on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementActions.setHomeScreenManagementFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should navigate to create page on openCreateNewHomeScreen', () => {
    component.openCreateNewHomeScreen();
    expect(router.navigate).toHaveBeenCalledWith([
      '/application-management',
      'home-screen-management',
      'form-home',
      'create',
    ]);
  });

  it('should dispatch setHomeScreenManagementFilters on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(50);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementActions.setHomeScreenManagementFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should set edit order and dispatch actions', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setEditOrder(true);
    expect(component.isEditOrder()).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.setIsEditOrderMode({ isEditOrder: true })
    );
    component.setEditOrder(false);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.setOrderDirty({ isDirty: false })
    );
  });

  it('should call setEditOrder(false) if not dirty in cancelEditOrder', () => {
    const setEditOrderSpy = jest.spyOn(component, 'setEditOrder');
    component.isOrderDirty.set(false);
    component.cancelEditOrder();
    expect(setEditOrderSpy).toHaveBeenCalledWith(false);
  });

  it('should open dialog and dispatch reset if dirty in cancelEditOrder', () => {
    component.isOrderDirty.set(true);
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(true)),
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.cancelEditOrder();
    expect(dialog.open).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.resetAll()
    );
  });

  it('should open dialog and dispatch reOrderHomeScreenManagements on publishItems', () => {
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(true)),
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.publishItems();
    expect(dialog.open).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.reOrderHomeScreenManagements()
    );
  });

  it('should not dispatch reOrderHomeScreenManagements if dialog not confirmed in publishItems', () => {
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(false)),
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.publishItems();
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.reOrderHomeScreenManagements()
    );
  });

  it('should dispatch updateHomeScreenManagementsOrder on onDragDropChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { data: [{ id: 1 }] } as any;
    component.onDragDropChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.updateHomeScreenManagementsOrder({
        newList: event.data,
      })
    );
  });

  it('should dispatch updatePublishedStatus on onToggleChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const rowData = { id: 1 } as HomeScreenManagement;
    const event = { checked: true } as MatSlideToggleChange;
    component.onToggleChange(event, rowData);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.updatePublishedStatus({
        id: 1,
        is_published: true,
      })
    );
  });

  it('should navigate to view-edit on onRowClick if hasEditPermission', () => {
    component.hasEditPermission = true;
    const row = { id: 123 } as HomeScreenManagement;
    component.onRowClick(row);
    expect(router.navigate).toHaveBeenCalledWith([
      'application-management',
      'home-screen-management',
      'form-home',
      123,
      'view-edit',
    ]);
  });

  it('should not navigate on onRowClick if !hasEditPermission', () => {
    component.hasEditPermission = false;
    const row = { id: 123 } as HomeScreenManagement;
    component.onRowClick(row);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should dispatch resetAll actions on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementActions.resetAll()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.resetAll()
    );
  });

  it('should open dialog and dispatch actions on reOrderHomeScreenManagementsSuccess', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(true)),
    });

    // Simulate ngOnInit subscription
    actions$.next(
      HomeScreenManagementOrderActions.reOrderHomeScreenManagementsSuccess()
    );

    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        message: 'The section order was updated',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'success',
      },
      width: '25rem',
    });

    // Simulate dialog close
    // The dialog.afterClosed().subscribe triggers the dispatches
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementActions.setHomeScreenManagementFilters({
        filters: { page: 0 },
      })
    );
    // setEditOrder(false) also dispatches setIsEditOrderMode and setOrderDirty
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.setIsEditOrderMode({
        isEditOrder: false,
      })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      HomeScreenManagementOrderActions.setOrderDirty({ isDirty: false })
    );
  });

  it('should not throw if dialog is closed without callback', () => {
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(undefined)),
    });

    actions$.next(
      HomeScreenManagementOrderActions.reOrderHomeScreenManagementsSuccess()
    );

    // No error should be thrown, and dialog should be opened
    expect(dialog.open).toHaveBeenCalled();
  });
});
