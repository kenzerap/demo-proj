import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoprojAutocompleteDropdownComponent } from './demoproj-autocomplete-dropdown.component';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  ControlContainer,
  Validators,
} from '@angular/forms';
import { GroupOption } from './models/group-option.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ValueCode } from '@app/shared/models/value-code.model';
import { of, Subject } from 'rxjs';

class MockControlContainer {
  control = new FormGroup({
    testField: new FormControl('', [Validators.required]),
  });
}

class MockChangeDetectorRef {
  markForCheck = jest.fn();
  detectChanges = jest.fn();
}

describe('DemoprojAutocompleteDropdownComponent', () => {
  let component: DemoprojAutocompleteDropdownComponent;
  let fixture: ComponentFixture<DemoprojAutocompleteDropdownComponent>;
  let mockControlContainer: MockControlContainer;
  let mockChangeDetectorRef: MockChangeDetectorRef;

  beforeEach(async () => {
    mockControlContainer = new MockControlContainer();
    mockChangeDetectorRef = new MockChangeDetectorRef();

    await TestBed.configureTestingModule({
      imports: [
        DemoprojAutocompleteDropdownComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ControlContainer, useValue: mockControlContainer },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoprojAutocompleteDropdownComponent);
    component = fixture.componentInstance;
    component.formControlName = 'testField';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize without formControlName', () => {
      component.formControlName = '';
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle control events subscription', () => {
      const eventSubject = new Subject();
      const mockControl = {
        events: eventSubject,
        validators: [Validators.required],
        errors: { required: true },
      } as any;

      jest
        .spyOn(mockControlContainer.control, 'get')
        .mockReturnValue(mockControl);

      component.ngOnInit();

      // Test touched event
      eventSubject.next({ touched: true } as any);
      expect(component.formControl.touched).toBeDefined();

      // Test value change event
      // const updateValidatorsSpy = jest.spyOn(component, 'updateValidators');
      // eventSubject.next({ type: 'value' } as any);
      // expect(updateValidatorsSpy).toHaveBeenCalled();
    });
  });

  describe('Input setters and getters', () => {
    it('should set and get groupOptions', () => {
      const options: GroupOption<any>[] = [
        {
          groupName: 'Group A',
          groupItems: [{ code: 'ABC', value: 'ABC Value' }],
        },
      ];
      component.groupOptions = options;
      expect(component.groupOptions).toEqual(options);
      expect(component.filteredGroupOptions.length).toBeGreaterThan(0);
    });

    it('should set and get nonGroupOptions', () => {
      const options: ValueCode[] = [
        { code: 'option1', value: 'Option 1' },
        { code: 'option2', value: 'Option 2' },
      ];
      component.nonGroupOptions = options;
      expect(component.nonGroupOptions).toEqual(options);
      expect(component.filteredNonGroupOptions.length).toBe(2);
    });

    it('should handle isGrouped property', () => {
      component.isGrouped = true;
      expect(component.isGrouped).toBe(true);

      component.isGrouped = false;
      expect(component.isGrouped).toBe(false);
    });

    it('should update filtered options when setting groupOptions with existing form value', () => {
      component.formControl.setValue('existing');
      const options: GroupOption<any>[] = [
        {
          groupName: 'Group A',
          groupItems: [{ code: 'existing', value: 'Existing Value' }],
        },
      ];
      component.groupOptions = options;
      expect(component.filteredGroupOptions).toBeDefined();
    });
  });

  describe('ControlValueAccessor methods', () => {
    it('should write value', () => {
      component.writeValue('test');
      expect(component.formControl.value).toBe('test');
    });

    it('should write null value', () => {
      component.writeValue(null);
      expect(component.formControl.value).toBe(null);
    });

    it('should register onChange callback', () => {
      const mockFn = jest.fn();
      component.registerOnChange(mockFn);

      // Trigger onChange
      (component as any).onChange('test');
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const mockFn = jest.fn();
      component.registerOnTouched(mockFn);
      component.onBlur();
      expect(mockFn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.formControl.disabled).toBe(true);

      component.setDisabledState(false);
      expect(component.formControl.enabled).toBe(true);
    });
  });

  describe('Filtering methods', () => {
    beforeEach(() => {
      component.groupOptions = [
        {
          groupName: 'Fruits',
          groupItems: [
            { code: 'apple', value: 'Apple' },
            { code: 'banana', value: 'Banana' },
          ],
        },
        {
          groupName: 'Vegetables',
          groupItems: [{ code: 'carrot', value: 'Carrot' }],
        },
      ];

      component.nonGroupOptions = [
        { code: 'option1', value: 'Option 1' },
        { code: 'option2', value: 'Another Option' },
      ];
    });

    it('should filter groups correctly', () => {
      const result = component.filterGroup('App');
      expect(result.length).toBe(1);
      expect(result[0].groupItems[0].code).toBe('apple');
    });

    it('should return all groups when filter is empty', () => {
      const result = component.filterGroup('');
      expect(result.length).toBe(2);
    });

    it('should filter non-group options', () => {
      const result = component.filterNonGroup('Option 1');
      expect(result.length).toBe(1);
      expect(result[0].code).toBe('option1');
    });

    it('should return all non-group options when filter is empty', () => {
      const result = component.filterNonGroup('');
      expect(result.length).toBe(2);
    });

    it('should filter items case-insensitively', () => {
      const items = [
        { code: 'test1', value: 'Test Item 1' },
        { code: 'test2', value: 'Another Test' },
      ];
      const result = component.filterItem(items, 'ITEM');
      expect(result.length).toBe(1);
      expect(result[0].code).toBe('test1');
    });

    it('should handle empty arrays in filterItem', () => {
      const result = component.filterItem([], 'test');
      expect(result).toEqual([]);
    });
  });

  describe('Display function', () => {
    beforeEach(() => {
      component.groupOptions = [
        {
          groupName: 'Group A',
          groupItems: [{ code: 'test-code', value: 'Test Value' }],
        },
      ];

      component.nonGroupOptions = [{ code: 'test-code', value: 'Test Value' }];
    });

    it('should display value for grouped options', () => {
      component.isGrouped = true;
      const result = component.displayFn('test-code');
      expect(result).toBe('Test Value');
    });

    it('should display value for non-grouped options', () => {
      component.isGrouped = false;
      const result = component.displayFn('test-code');
      expect(result).toBe('Test Value');
    });

    it('should return empty string for non-existent code', () => {
      const result = component.displayFn('non-existent');
      expect(result).toBe('');
    });

    it('should handle null/undefined code', () => {
      expect(component.displayFn(null)).toBe('');
    });
  });

  describe('Option selection', () => {
    it('should handle option selection', () => {
      const mockEvent = {
        option: {
          value: 'selected-code',
          viewValue: 'Selected Value',
          selected: true,
        },
      } as MatAutocompleteSelectedEvent;

      const onChangeSpy = jest.spyOn(component as any, 'onChange');
      const updateFilterSpy = jest.spyOn(component, 'updateFilteredOptions');
      const emitSpy = jest.spyOn(component.optionSelected, 'emit');

      component.onOptionSelected(mockEvent);

      expect(component.selectedCode).toBe('selected-code');
      expect(onChangeSpy).toHaveBeenCalledWith('selected-code');
      expect(updateFilterSpy).toHaveBeenCalledWith('selected-code');
      expect(emitSpy).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Filtered options update', () => {
    it('should update filtered options for grouped data', () => {
      component.isGrouped = true;
      component.groupOptions = [
        {
          groupName: 'Group A',
          groupItems: [{ code: 'test', value: 'Test' }],
        },
      ];

      component.updateFilteredOptions('test');
      expect(component.filteredGroupOptions).toBeDefined();
    });

    it('should update filtered options for non-grouped data', () => {
      component.isGrouped = false;
      component.nonGroupOptions = [{ code: 'test', value: 'Test' }];

      component.updateFilteredOptions('test');
      expect(component.filteredNonGroupOptions).toBeDefined();
    });
  });

  describe('Validation methods', () => {
    it('should update validators', () => {
      const spy = jest.spyOn(component.formControl, 'updateValueAndValidity');
      component.updateValidators();
      expect(spy).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should copy validators from parent control', () => {
      const setValidatorsSpy = jest.spyOn(
        component.formControl,
        'setValidators'
      );
      const setErrorsSpy = jest.spyOn(component.formControl, 'setErrors');

      component.updateValidators();

      expect(setValidatorsSpy).toHaveBeenCalled();
      expect(setErrorsSpy).toHaveBeenCalled();
    });
  });

  describe('Component styling', () => {
    it('should return selected item style', () => {
      const style = component.selectedItemStyle();
      expect(style).toEqual({
        'background-color': 'var(--mat-option-selected-state-layer-color)',
        color: 'var(--mat-option-selected-state-label-text-color)',
      });
    });
  });

  describe('Form control value changes', () => {
    it('should handle form control value changes', (done) => {
      const onChangeSpy = jest.spyOn(component as any, 'onChange');
      component.selectedCode = 'existing-code';

      component.formControl.markAsTouched();
      component.formControl.setValue('new-value');

      // Use setTimeout to handle async behavior
      setTimeout(() => {
        expect(component.selectedCode).toBe('');
        expect(onChangeSpy).toHaveBeenCalledWith('');
        done();
      }, 0);
    });
  });

  describe('Component lifecycle', () => {
    it('should handle component destruction', () => {
      const destroySpy = jest.spyOn((component as any).destroy$, 'next');
      const completeSpy = jest.spyOn((component as any).destroy$, 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty groupOptions', () => {
      component.groupOptions = [];
      const result = component.filterGroup('test');
      expect(result).toEqual([]);
    });

    it('should handle empty nonGroupOptions', () => {
      component.nonGroupOptions = [];
      const result = component.filterNonGroup('test');
      expect(result).toEqual([]);
    });

    it('should handle null/undefined values in displayFn', () => {
      expect(component.displayFn('')).toBe('');
      expect(component.displayFn(' ')).toBe('');
    });

    it('should handle case-insensitive filtering', () => {
      const items = [{ code: 'TEST', value: 'test value' }];
      const result = component.filterItem(items, 'test');
      expect(result.length).toBe(1);
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully in updateValidators', () => {
      // Mock a scenario where parent control doesn't exist
      jest.spyOn(mockControlContainer.control, 'get').mockReturnValue(null);

      expect(() => component.updateValidators()).not.toThrow();
    });

    it('should handle missing form control in onChange', () => {
      const onChange = (component as any).onChange;
      expect(() => onChange('test')).not.toThrow();
    });
  });
});
