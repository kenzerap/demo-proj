import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { HospitalListComponent } from './hospital-list.component';
import * as HospitalActions from '../../stores/hospital-list/hospital-list.actions';
import * as HospitalOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as HospitalOrderSelector from '../../stores/reorder-list/reorder-list.selectors';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Actions } from '@ngrx/effects';
import { Hospital } from '../../models/hospital.model';

describe('HospitalListComponent', () => {
  let component: HospitalListComponent;
  let fixture: ComponentFixture<HospitalListComponent>;
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
      imports: [HospitalListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: HospitalOrderSelector.selectIsOrderDirty,
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

    fixture = TestBed.createComponent(HospitalListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setHospitalFilters on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      HospitalActions.setHospitalFilters({
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

  it('should dispatch setHospitalFilters on onPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageChange(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HospitalActions.setHospitalFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should navigate to create page on openCreateNewHospital', () => {
    component.openCreateNewHospital();
    expect(router.navigate).toHaveBeenCalledWith([
      '/master-data-management',
      'hospital',
      'form',
      'create',
    ]);
  });

  it('should dispatch setHospitalFilters on onPageSizeChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onPageSizeChange(50);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HospitalActions.setHospitalFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should set edit order and dispatch actions', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setEditOrder(true);
    expect(component.isEditOrder()).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HospitalOrderActions.setIsEditOrderMode({ isEditOrder: true })
    );
    component.setEditOrder(false);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HospitalOrderActions.setOrderDirty({ isDirty: false })
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
    expect(dispatchSpy).toHaveBeenCalledWith(HospitalOrderActions.resetAll());
  });

  it('should open dialog and dispatch reOrderHospitals on publishItems', () => {
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(true)),
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.publishItems();
    expect(dialog.open).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      HospitalOrderActions.reOrderHospitals()
    );
  });

  it('should not dispatch reOrderHospitals if dialog not confirmed in publishItems', () => {
    dialog.open = jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(false)),
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.publishItems();
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      HospitalOrderActions.reOrderHospitals()
    );
  });

  it('should dispatch updateHospitalsOrder on onDragDropChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { data: [{ id: 1 }] } as any;
    component.onDragDropChange(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HospitalOrderActions.updateHospitalsOrder({
        newList: event.data,
      })
    );
  });

  it('should dispatch updatePublishedStatus on onToggleChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const rowData = { hospital_id: 1 } as Hospital;
    const event = { checked: true } as MatSlideToggleChange;
    component.onToggleChange(event, rowData);
    expect(dispatchSpy).toHaveBeenCalledWith(
      HospitalOrderActions.updatePublishedStatus({
        id: 1,
        is_published: true,
      })
    );
  });

  it('should dispatch resetAll actions on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(HospitalActions.resetAll());
    expect(dispatchSpy).toHaveBeenCalledWith(HospitalOrderActions.resetAll());
  });
});
