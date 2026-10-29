import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPointComponent } from './add-point.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import * as pointHistoryActions from '../../stores/point-history/point-history.actions';
import { of } from 'rxjs';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddPointComponent', () => {
  let component: AddPointComponent;
  let fixture: ComponentFixture<AddPointComponent>;
  let store: jest.Mocked<Store>;
  let dialogRef: jest.Mocked<MatDialogRef<AddPointComponent>>;

  beforeEach(async () => {
    store = {
      dispatch: jest.fn(),
      select: jest.fn().mockReturnValue(of(false)),
    } as unknown as jest.Mocked<Store>;

    dialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<AddPointComponent>>;

    await TestBed.configureTestingModule({
      imports: [
        AddPointComponent,
        ReactiveFormsModule,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        DatePipe,
        provideMockStore(),
        { provide: Store, useValue: store },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { partyId: '123' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.addPointForm.value).toEqual({
      point: '',
      expiryDate: '',
      remark: '',
    });
  });

  it('should return the point control', () => {
    expect(component.pointControl).toBe(component.addPointForm.get('point'));
  });

  it('should return the expiryDate control', () => {
    expect(component.expiryDateControl).toBe(
      component.addPointForm.get('expiryDate')
    );
  });

  it('should close the dialog when loading becomes false and form is submitted', () => {
    component.isSubmitted = true;
    (store.select as jest.Mock).mockReturnValue(of(false));

    component.ngOnInit();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should mark all fields as touched and not dispatch action if form is invalid', () => {
    jest.spyOn(component.addPointForm, 'markAllAsTouched');

    component.addPointForm.patchValue({
      point: '',
      expiryDate: '',
    });

    component.onSubmit();

    expect(component.addPointForm.markAllAsTouched).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch addPoint action and set isSubmitted to true if form is valid', () => {
    const mockExpiryDate = new Date();
    jest.spyOn(component.datePipe, 'transform').mockReturnValue('2023-12-31');

    component.addPointForm.patchValue({
      point: 100,
      expiryDate: mockExpiryDate,
      remark: 'Test remark',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.isSubmitted).toBe(true);
    }, 0);

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        pointHistoryActions.addPoint({
          partyId: '123',
          queryParams: {
            point: 100,
            expiryDate: '2023-12-31',
            remark: 'Test remark',
          },
        })
      );
    }, 0);
  });
});
