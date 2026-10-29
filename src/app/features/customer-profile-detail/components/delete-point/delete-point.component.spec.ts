import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletePointComponent } from './delete-point.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import * as pointHistoryActions from '../../stores/point-history/point-history.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DeletePointComponent', () => {
  let component: DeletePointComponent;
  let fixture: ComponentFixture<DeletePointComponent>;
  let store: MockStore;
  let dialogRef: jest.Mocked<MatDialogRef<DeletePointComponent>>;

  beforeEach(async () => {
    dialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<DeletePointComponent>>;

    await TestBed.configureTestingModule({
      imports: [
        DeletePointComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: 'selectIsLoading',
              value: of(false),
            },
          ],
        }),
        { provide: MAT_DIALOG_DATA, useValue: { partyId: '123' } },
        { provide: MatDialogRef, useValue: dialogRef },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePointComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.addPointForm.value).toEqual({
      point: '',
      remark: '',
    });
  });

  it('should return the point control', () => {
    expect(component.pointControl).toBe(component.addPointForm.get('point'));
  });

  it('should return the remark control', () => {
    expect(component.remarkControl).toBe(component.addPointForm.get('remark'));
  });

  it('should trim spaces from the specified control', () => {
    component.addPointForm.patchValue({ remark: '  test remark  ' });
    component.trimSpaces('remark');
    expect(component.remarkControl?.value).toBe('test remark');
  });

  it('should close the dialog when loading becomes false and form is submitted', () => {
    component.isSubmitted = true;
    store.overrideSelector('selectIsLoading', false);

    component.ngOnInit();

    setTimeout(() => {
      expect(dialogRef.close).toHaveBeenCalled();
    }, 0);
  });

  it('should mark all fields as touched and not dispatch action if form is invalid', () => {
    jest.spyOn(component.addPointForm, 'markAllAsTouched');

    component.addPointForm.patchValue({
      point: '',
      remark: '',
    });

    component.onSubmit();

    expect(component.addPointForm.markAllAsTouched).toHaveBeenCalled();

    setTimeout(() => {
      expect(store.dispatch).not.toHaveBeenCalled();
    }, 0);
  });

  it('should dispatch deletePoint action and set isSubmitted to true if form is valid', () => {
    jest.spyOn(store, 'dispatch');

    component.addPointForm.patchValue({
      point: 100,
      remark: 'Valid remark',
    });

    component.onSubmit();

    expect(component.isSubmitted).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      pointHistoryActions.deletePoint({
        partyId: '123',
        queryParams: {
          point: 100,
          remark: 'Valid remark',
        },
      })
    );
  });
});
