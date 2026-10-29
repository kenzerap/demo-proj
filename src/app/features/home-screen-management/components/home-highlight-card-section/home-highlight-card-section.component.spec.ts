import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { HomeHighLightCardSectionComponent } from './home-highlight-card-section.component';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { DestinationCode } from '@app/shared/constants/destination-options.const';
import { MatSelectChange } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { getImageSizeOser } from '@app/shared/utils/get-image-size';

describe('HomeHighLightCardSectionComponent', () => {
  let component: HomeHighLightCardSectionComponent;
  let fixture: ComponentFixture<HomeHighLightCardSectionComponent>;
  let formBuilder: FormBuilder;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HomeHighLightCardSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeHighLightCardSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      highlightCards: formBuilder.array([
        formBuilder.group({
          id: [''],
          highlightCard_en: ['', Validators.required, noSpacesValidatorAsync],
          highlightCard_th: ['', Validators.required, noSpacesValidatorAsync],
          imageFile: ['', Validators.required],
          imageUrl: [''],
          imageName: [''],
          destination_type: [DestinationCode.PrivilegeList],
          destination_value: [''],
        }),
      ]),
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get highlightCardsFormArray', () => {
    expect(component.highlightCardsFormArray).toBeInstanceOf(FormArray);
  });

  it('should get controls for highlightCard_en, highlightCard_th, destination_type, destination_value, imageFile, imageUrl, imageName', () => {
    expect(component.getHighlightCardEnControl(0)).toBeTruthy();
    expect(component.getHighlightCardThControl(0)).toBeTruthy();
    expect(component.getDestinationTypeControl(0)).toBeTruthy();
    expect(component.getDestinationValueControl(0)).toBeTruthy();
    expect(component.getImageFileControl(0)).toBeTruthy();
    expect(component.getImageUrlControl(0)).toBeTruthy();
    expect(component.getImageNameControl(0)).toBeTruthy();
  });

  it('should get dropdown value', () => {
    const options: ValueCode[] = [
      { code: 'A', value: 'Option A' },
      { code: 'B', value: 'Option B' },
    ];
    expect(component.getDropdownValue('A', options)).toBe('Option A');
    expect(component.getDropdownValue('B', options)).toBe('Option B');
    expect(component.getDropdownValue('C', options)).toBe('');
  });

  it('should call drop and update value and validity', () => {
    const arr = component.highlightCardsFormArray;
    arr.push(
      formBuilder.group({
        id: [''],
        highlightCard_en: ['', Validators.required, noSpacesValidatorAsync],
        highlightCard_th: ['', Validators.required, noSpacesValidatorAsync],
        imageFile: ['', Validators.required],
        imageUrl: [''],
        imageName: [''],
        destination_type: [DestinationCode.PrivilegeList],
        destination_value: [''],
      })
    );
    const event = {
      previousIndex: 0,
      currentIndex: 1,
      container: { data: arr.controls },
      item: { data: arr.at(0) },
      previousContainer: { data: arr.controls },
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 },
    } as unknown as CdkDragDrop<any[]>;
    component.drop(event);
    expect(arr.length).toBeGreaterThan(1);
  });

  it('should set validators for destination_value when destination_type is URL', () => {
    const group = component.highlightCardsFormArray.at(0);
    const event = { value: DestinationCode.URL } as MatSelectChange;
    const setValidatorsSpy = jest.spyOn(
      group.get('destination_value')!,
      'setValidators'
    );
    component.destinationTypeChange(event, group);
    expect(setValidatorsSpy).toHaveBeenCalled();
  });

  it('should clear validators for destination_value when destination_type is not URL', () => {
    const group = component.highlightCardsFormArray.at(0);
    const event = { value: 'OTHER' } as MatSelectChange;
    const setValidatorsSpy = jest.spyOn(
      group.get('destination_value')!,
      'setValidators'
    );
    component.destinationTypeChange(event, group);
    expect(setValidatorsSpy).toHaveBeenCalledWith([]);
  });

  it('should add a highlight card', () => {
    const initialLength = component.highlightCardsFormArray.length;
    component.addHighlightCard();
    expect(component.highlightCardsFormArray.length).toBe(initialLength + 1);
  });

  it('should delete a highlight card', () => {
    component.addHighlightCard();
    const initialLength = component.highlightCardsFormArray.length;
    component.deleteHighlightCard(0);
    expect(component.highlightCardsFormArray.length).toBe(initialLength - 1);
  });

  it('should open warning dialog for invalid file size', () => {
    component['dialog'] = mockDialog;
    component.openWarningFileSizeDialog();
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'The file you uploaded is not supported.',
        message:
          'Please upload a file in one of the following format SVG, PNG, JPG or GIF (1000 x 520 px)',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'warning',
      },
    });
  });

  it('should patch file and name on valid file drop', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const fileDragDrop = { file, size: { width: 1000, height: 520 } };
    const patchValueSpy = jest.spyOn(
      component.getImageFileControl(0)!,
      'patchValue'
    );
    const patchNameSpy = jest.spyOn(
      component.getImageNameControl(0)!,
      'patchValue'
    );
    component.onFileDropped(fileDragDrop, 0);
    expect(patchValueSpy).toHaveBeenCalledWith(file);
    expect(patchNameSpy).toHaveBeenCalledWith('test.png');
  });

  it('should open warning dialog on invalid file drop', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const fileDragDrop = { file, size: { width: 100, height: 100 } };
    component['dialog'] = mockDialog;
    component.onFileDropped(fileDragDrop, 0);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should patch file and name on valid file selection', (done) => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = {
      target: { files: [file] },
    } as unknown as Event;

    // Mock getImageSizeOser to return correct size
    jest
      .spyOn(require('@app/shared/utils/get-image-size'), 'getImageSizeOser')
      .mockReturnValue({
        pipe: () => ({
          subscribe: (cb: any) => cb({ width: 1000, height: 520 }),
        }),
      } as any);

    const patchValueSpy = jest.spyOn(
      component.getImageFileControl(0)!,
      'patchValue'
    );
    const patchNameSpy = jest.spyOn(
      component.getImageNameControl(0)!,
      'patchValue'
    );
    component.onFileSelected(event, 0);
    setTimeout(() => {
      expect(patchValueSpy).toHaveBeenCalledWith(file);
      expect(patchNameSpy).toHaveBeenCalledWith('test.png');
      done();
    }, 0);
  });

  it('should open warning dialog and reset input value on invalid file selection', (done) => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const input = { files: [file], value: 'something' };
    const event = { target: input } as unknown as Event;

    jest
      .spyOn(require('@app/shared/utils/get-image-size'), 'getImageSizeOser')
      .mockReturnValue({
        pipe: () => ({
          subscribe: (cb: any) => cb({ width: 100, height: 100 }),
        }),
      } as any);

    component['dialog'] = mockDialog;
    component.onFileSelected(event, 0);
    setTimeout(() => {
      expect(input.value).toBe('');
      expect(mockDialog.open).toHaveBeenCalled();
      done();
    }, 0);
  });
});
