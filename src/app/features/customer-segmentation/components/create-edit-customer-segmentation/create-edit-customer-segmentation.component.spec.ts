import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditCustomerSegmentationComponent } from './create-edit-customer-segmentation.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as CreateEditCustomerSegmentationActions from '../../stores/create-edit-customer-segmentation/create-edit-customer-segmentation.actions';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateEditCustomerSegmentationComponent', () => {
  let component: CreateEditCustomerSegmentationComponent;
  let fixture: ComponentFixture<CreateEditCustomerSegmentationComponent>;
  let store: MockStore;
  let actions$: ReplaySubject<any>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      params: of({ id: '123' }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEditCustomerSegmentationComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        FormBuilder,
        DatePipe,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditCustomerSegmentationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and fetch customer segment details on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditCustomerSegmentationActions.getCustomerSegmentationDetail({
        id: 123,
      })
    );
  });

  it('should mark form as dirty on value changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.baseDetailForm.patchValue({ name: 'Test Name' });
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditCustomerSegmentationActions.setFormDirty({ isDirty: true })
    );
  });

  it('should handle successful creation of customer segmentation', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.setFormMode('create');
    actions$.next(
      CreateEditCustomerSegmentationActions.createCustomerSegmentationSuccess()
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditCustomerSegmentationActions.setFormDirty({ isDirty: false })
    );
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        message: 'The customer segmentation was created',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'success',
      },
      width: '25rem',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'user-management',
      'customer-segmentation',
      'list',
    ]);
  });

  it('should validate and submit the form in create mode', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.baseDetailForm.patchValue({
      status: true,
      name: 'Test Name',
      description: 'Test Description',
    });
    component.segmentGroupConditionForm.patchValue({
      segment_groups: [
        {
          group_name: 'Group 1',
          logical_operator: 'AND',
          segment_rules: [
            {
              attribute: 'attr1',
              rule_value: 'value1',
              rule_expression: 'EQUALS',
              active_from_date: '2023-10-01',
              active_to_date: '2023-10-31',
            },
          ],
        },
      ],
    });

    component.onSubmit();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditCustomerSegmentationActions.createCustomerSegmentation({
          data: {},
        })
      );
    }, 0);
  });

  it('should mark all fields as touched if form is invalid', () => {
    jest.spyOn(component.baseDetailForm, 'markAllAsTouched');
    jest.spyOn(component.segmentGroupConditionForm, 'markAllAsTouched');

    component.onSubmit();

    expect(component.baseDetailForm.markAllAsTouched).toHaveBeenCalled();
    expect(
      component.segmentGroupConditionForm.markAllAsTouched
    ).toHaveBeenCalled();
  });

  it('should set form mode and enable/disable forms accordingly', () => {
    jest.spyOn(component, 'enableAllForm');
    jest.spyOn(component, 'disableAllForm');
    jest.spyOn(store, 'dispatch');

    component.setFormMode('edit');
    expect(component.formMode()).toBe('edit');
    expect(component.enableAllForm).toHaveBeenCalled();

    component.setFormMode('view');
    expect(component.formMode()).toBe('view');
    setTimeout(() => {
      expect(component.disableAllForm).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        CreateEditCustomerSegmentationActions.setFormDirty({ isDirty: false })
      );
    }, 0);
  });

  it('should trim spaces from a form control', () => {
    component.baseDetailForm.patchValue({ name: '  Test Name  ' });
    component.trimSpaces('name');
    expect(component.baseDetailForm.get('name')?.value).toBe('Test Name');
  });

  it('should disable all forms', () => {
    jest.spyOn(component.baseDetailForm, 'disable');
    jest.spyOn(component.segmentGroupConditionForm, 'disable');

    component.disableAllForm();

    expect(component.baseDetailForm.disable).toHaveBeenCalledWith({
      emitEvent: false,
    });
    expect(component.segmentGroupConditionForm.disable).toHaveBeenCalledWith({
      emitEvent: false,
    });
  });

  it('should enable all forms', () => {
    jest.spyOn(component.baseDetailForm, 'enable');
    jest.spyOn(component.segmentGroupConditionForm, 'enable');

    component.enableAllForm();

    expect(component.baseDetailForm.enable).toHaveBeenCalledWith({
      emitEvent: false,
    });
    expect(component.segmentGroupConditionForm.enable).toHaveBeenCalledWith({
      emitEvent: false,
    });
  });

  it('should toggle block status', () => {
    component.onBlockToggle({ checked: false } as any);
    expect(component.statusControl?.value).toBe(false);

    component.onBlockToggle({ checked: true } as any);
    expect(component.statusControl?.value).toBe(true);
  });

  it('should dispatch resetAll on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      CreateEditCustomerSegmentationActions.resetAll()
    );
  });
});
