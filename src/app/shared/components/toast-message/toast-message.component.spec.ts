import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastMessageComponent } from './toast-message.component';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { ToastMessageType } from '../../utils/enums/toast-message-type.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ToastMessageComponent', () => {
  let component: ToastMessageComponent;
  let fixture: ComponentFixture<ToastMessageComponent>;
  let matSnackBarRefMock: jest.Mocked<MatSnackBarRef<ToastMessageComponent>>;

  beforeEach(async () => {
    matSnackBarRefMock = {
      dismiss: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBarRef<ToastMessageComponent>>;

    await TestBed.configureTestingModule({
      imports: [ToastMessageComponent],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            type: ToastMessageType.SUCCESS,
            title: 'Success',
            message: 'Operation successful',
          },
        },
        { provide: MatSnackBarRef, useValue: matSnackBarRefMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct color for SUCCESS type', () => {
    component.data.type = ToastMessageType.SUCCESS;
    expect(component.getColorIcon()).toBe('#10973E');
  });

  it('should return the correct color for ERROR type', () => {
    component.data.type = ToastMessageType.ERROR;
    expect(component.getColorIcon()).toBe('#c72b29');
  });

  it('should return the correct color for WARNING type', () => {
    component.data.type = ToastMessageType.WARNING;
    expect(component.getColorIcon()).toBe('#DE900E');
  });

  it('should return an empty string for an unknown type', () => {
    component.data.type = 'UNKNOWN' as ToastMessageType;
    expect(component.getColorIcon()).toBe('');
  });

  it('should dismiss the snackbar when close is called', () => {
    component.close();
    expect(matSnackBarRefMock.dismiss).toHaveBeenCalled();
  });
});
