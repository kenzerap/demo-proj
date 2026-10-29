import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
  FormGroup,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import {
  noSpacesValidator,
  noSpacesValidatorAsync,
} from '@app/shared/utils/no-spaces-validator';
import { DestinationCode } from '@app/shared/constants/destination-options.const';
import { HomeShortcutMenuSectionComponent } from './home-shortcut-menu-section.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { urlValidator } from '@app/shared/utils/url-validator';

describe('HomeShortcutMenuSectionComponent', () => {
  let component: HomeShortcutMenuSectionComponent;
  let fixture: ComponentFixture<HomeShortcutMenuSectionComponent>;
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
        HomeShortcutMenuSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeShortcutMenuSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      shortcutMenus: formBuilder.array([
        formBuilder.group({
          id: [''],
          shortcut_en: ['', Validators.required, noSpacesValidatorAsync],
          shortcut_th: ['', Validators.required, noSpacesValidatorAsync],
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

  it('should get shortcutMenusFormArray', () => {
    expect(component.shortcutMenusFormArray).toBeInstanceOf(FormArray);
  });

  it('should get controls for shortcut_en, shortcut_th, destination_type, destination_value, imageFile, imageUrl, imageName', () => {
    expect(component.getShortcutEnControl(0)).toBeTruthy();
    expect(component.getShortcutThControl(0)).toBeTruthy();
    expect(component.getDestinationTypeControl(0)).toBeTruthy();
    expect(component.getDestinationValueControl(0)).toBeTruthy();
    expect(component.getImageFileControl(0)).toBeTruthy();
    expect(component.getImageUrlControl(0)).toBeTruthy();
    expect(component.getImageNameControl(0)).toBeTruthy();
  });

  it('should open warning dialog for invalid file size', () => {
    component['dialog'] = mockDialog;
    component.openWarningFileSizeDialog();
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'The file you uploaded is not supported.',
        message:
          'Please upload a file in one of the following format SVG, PNG, JPG or GIF (144 x 144 px)',
        btnConfirmText: 'Close',
        hideConfirmIcon: true,
        type: 'warning',
      },
    });
  });

  it('should patch file and name on valid file drop', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const fileDragDrop = { file, size: { width: 144, height: 144 } };
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
          subscribe: (cb: any) => cb({ width: 144, height: 144 }),
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

  it('should open warning dialog and clear input on invalid file selection', (done) => {
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

  it('should return dropdown value', () => {
    const options = [
      { code: 'A', value: 'Option A' },
      { code: 'B', value: 'Option B' },
    ];
    expect(component.getDropdownValue('A', options)).toBe('Option A');
    expect(component.getDropdownValue('C', options)).toBe('');
  });

  it('should reorder shortcutMenusFormArray on drop', () => {
    const arr = component.shortcutMenusFormArray;
    arr.push(
      formBuilder.group({
        id: [''],
        shortcut_en: ['', Validators.required, noSpacesValidatorAsync],
        shortcut_th: ['', Validators.required, noSpacesValidatorAsync],
        imageFile: ['', Validators.required],
        imageUrl: [''],
        imageName: [''],
        destination_type: [DestinationCode.PrivilegeList],
        destination_value: [''],
      })
    );
    const updateSpy = jest.spyOn(arr, 'updateValueAndValidity');
    component.drop({
      previousIndex: 0,
      currentIndex: 1,
      container: null,
      item: null,
    } as any);
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should set validators for destination_value when destinationTypeChange is URL', () => {
    const group = component.shortcutMenusFormArray.at(0)!;
    const setValidatorsSpy = jest.spyOn(
      group.get('destination_value')!,
      'setValidators'
    );
    component.destinationTypeChange(
      { value: DestinationCode.URL } as any,
      group
    );
    expect(setValidatorsSpy).toHaveBeenCalledWith([
      Validators.required,
      noSpacesValidator,
      urlValidator,
    ]);
  });

  it('should clear validators for destination_value when destinationTypeChange is not URL', () => {
    const group = component.shortcutMenusFormArray.at(0)!;
    const setValidatorsSpy = jest.spyOn(
      group.get('destination_value')!,
      'setValidators'
    );
    component.destinationTypeChange(
      { value: DestinationCode.PrivilegeList } as any,
      group
    );
    expect(setValidatorsSpy).toHaveBeenCalledWith([]);
  });

  it('should add a shortcut', () => {
    const initialLength = component.shortcutMenusFormArray.length;
    component.addShortcut();
    expect(component.shortcutMenusFormArray.length).toBe(initialLength + 1);
  });

  it('should delete a shortcut', () => {
    component.addShortcut();
    const initialLength = component.shortcutMenusFormArray.length;
    component.deleteShortcutMenu(0);
    expect(component.shortcutMenusFormArray.length).toBe(initialLength - 1);
  });

  it('should not patch file if fileDragDrop.size is undefined', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const fileDragDrop = { file, size: undefined };
    const patchValueSpy = jest.spyOn(
      component.getImageFileControl(0)!,
      'patchValue'
    );
    component.onFileDropped(fileDragDrop as any, 0);
    expect(patchValueSpy).not.toHaveBeenCalled();
  });

  it('should not patch file if getImageFileControl returns null', () => {
    jest.spyOn(component, 'getImageFileControl').mockReturnValue(null as any);
    const file = new File([''], 'test.png', { type: 'image/png' });
    const fileDragDrop = { file, size: { width: 144, height: 144 } };
    component.onFileDropped(fileDragDrop, 0);
    // No error should be thrown
  });

  it('should handle onFileSelected with no files', () => {
    const event = { target: { files: [] } } as unknown as Event;
    component.onFileSelected(event, 0);
    // No error should be thrown
  });

  it('should handle onFileSelected with null files', () => {
    const event = { target: { files: null } } as unknown as Event;
    component.onFileSelected(event, 0);
    // No error should be thrown
  });

  it('should handle getDropdownValue with null selectedCode', () => {
    const options = [
      { code: 'A', value: 'Option A' },
      { code: 'B', value: 'Option B' },
    ];
    expect(component.getDropdownValue(null, options)).toBe('');
  });

  it('should handle drop with no controls', () => {
    const arr = component.shortcutMenusFormArray;
    const updateSpy = jest.spyOn(arr, 'updateValueAndValidity');
    component.drop({
      previousIndex: 0,
      currentIndex: 0,
      container: null,
      item: null,
    } as any);
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should not throw if deleteShortcutMenu is called with invalid index', () => {
    expect(() => component.deleteShortcutMenu(99)).not.toThrow();
  });

  it('should handle destinationTypeChange with undefined event value', () => {
    const group = component.shortcutMenusFormArray.at(0)!;
    const setValidatorsSpy = jest.spyOn(
      group.get('destination_value')!,
      'setValidators'
    );
    component.destinationTypeChange({ value: undefined } as any, group);
    expect(setValidatorsSpy).toHaveBeenCalledWith([]);
  });

  it('should handle addShortcut and deleteShortcutMenu for multiple items', () => {
    component.addShortcut();
    component.addShortcut();
    expect(component.shortcutMenusFormArray.length).toBeGreaterThan(2);
    component.deleteShortcutMenu(1);
    expect(component.shortcutMenusFormArray.length).toBeGreaterThan(0);
  });

  it('should handle get*Control methods with out-of-bounds index', () => {
    expect(component.getShortcutEnControl(99)).toBeFalsy();
    expect(component.getShortcutThControl(99)).toBeFalsy();
    expect(component.getDestinationTypeControl(99)).toBeFalsy();
    expect(component.getDestinationValueControl(99)).toBeFalsy();
    expect(component.getImageFileControl(99)).toBeFalsy();
    expect(component.getImageUrlControl(99)).toBeFalsy();
    expect(component.getImageNameControl(99)).toBeFalsy();
  });
});
