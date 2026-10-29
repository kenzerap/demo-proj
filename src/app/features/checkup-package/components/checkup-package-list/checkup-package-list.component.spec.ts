import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CheckupPackageListComponent } from './checkup-package-list.component';
import * as CheckupPackageActions from '../../stores/checkup-package-list/checkup-package-list.actions';
import * as CheckupPackageOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as CheckupPackageOrderSelector from '../../stores/reorder-list/reorder-list.selectors';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CheckupPackage } from '../../models/checkup-package.model';
import { Actions } from '@ngrx/effects';

describe('CheckupPackageListComponent', () => {
  let component: CheckupPackageListComponent;
  let fixture: ComponentFixture<CheckupPackageListComponent>;
  let store: MockStore;
  let dialog: any;
  let router: any;
  let hasPermissionService: any;

  beforeEach(async () => {
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
      imports: [CheckupPackageListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: CheckupPackageOrderSelector.selectIsOrderDirty,
              value: false,
            },
          ],
        }),
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router },
        { provide: HasPermissionService, useValue: hasPermissionService },
        { provide: Actions, useValue: of() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckupPackageListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setCheckupPackageFilters on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageActions.setCheckupPackgageFilters({
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

  it('should dispatch setCheckupPackageFilters on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageActions.setCheckupPackgageFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should navigate to create page on openCreateNewCheckupPackage', () => {
    component.openCreateNewCheckupPackage();
    expect(router.navigate).toHaveBeenCalledWith([
      '/master-data-management',
      'checkup-package',
      'form-checkup-package',
      'create',
    ]);
  });

  it('should dispatch setCheckupPackageFilters on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(50);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageActions.setCheckupPackgageFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should set edit order and dispatch actions', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setEditOrder(true);
    expect(component.isEditOrder()).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageOrderActions.setIsEditOrderMode({ isEditOrder: true })
    );
    component.setEditOrder(false);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageOrderActions.setOrderDirty({ isDirty: false })
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
      CheckupPackageOrderActions.resetAll()
    );
  });

  it('should open dialog and dispatch reOrderCheckupPackages on publishItems', () => {
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(true)),
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.publishItems();
    expect(dialog.open).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageOrderActions.reOrderCheckupPackages()
    );
  });

  it('should not dispatch reOrderCheckupPackages if dialog not confirmed in publishItems', () => {
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(false)),
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.publishItems();
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      CheckupPackageOrderActions.reOrderCheckupPackages()
    );
  });

  it('should dispatch updateCheckupPackagesOrder on onDragDropChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { data: [{ id: 1 }] } as any;
    component.onDragDropChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageOrderActions.updateCheckupPackagesOrder({
        newList: event.data,
      })
    );
  });

  it('should dispatch updatePublishedStatus on onToggleChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const rowData = { id: 1 } as CheckupPackage;
    const event = { checked: true } as MatSlideToggleChange;
    component.onToggleChange(event, rowData);
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageOrderActions.updatePublishedStatus({
        id: 1,
        is_published: true,
      })
    );
  });

  it('should dispatch resetAll actions on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(CheckupPackageActions.resetAll());
    expect(dispatchSpy).toHaveBeenCalledWith(
      CheckupPackageOrderActions.resetAll()
    );
  });
});
