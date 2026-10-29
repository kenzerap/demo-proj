import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { NationalitySectionComponent } from './nationality-section.component';
import * as CreateEditFundTypeSelectors from '../../stores/create-edit-fund-type/create-edit-fund-type.selectors';
import { FundType } from '../../models/fund-type.model';

describe('NationalitySectionComponent', () => {
  let component: NationalitySectionComponent;
  let fixture: ComponentFixture<NationalitySectionComponent>;
  let formBuilder: FormBuilder;

  const rawNationalityOptions = [
    {
      nationality_id: 1,
      nationality_code: 'THA',
      name_th: 'ไทย',
      name_en: 'Thai',
    },
    {
      nationality_id: 2,
      nationality_code: 'USA',
      name_th: 'อเมริกัน',
      name_en: 'American',
    },
  ];

  function createComponent(
    options: {
      formMode?: 'create' | 'edit' | 'view';
      fundTypeDetail?: Partial<FundType> | null;
      nationalityOptionsValue?: typeof rawNationalityOptions;
    } = {},
  ) {
    TestBed.configureTestingModule({
      imports: [
        NationalitySectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        provideMockStore({
          selectors: [
            {
              selector: CreateEditFundTypeSelectors.selectNationalityOptions,
              value: options.nationalityOptionsValue ?? rawNationalityOptions,
            },
            {
              selector: CreateEditFundTypeSelectors.selectFundTypeDetail,
              value: options.fundTypeDetail ?? null,
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(NationalitySectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      nationalities: formBuilder.array([
        formBuilder.group({
          nationality: ['', Validators.required],
          allowed: [false],
        }),
      ]),
    });
    component.formMode = options.formMode ?? 'create';
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('basic behaviour', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should get nationalitiesFormArray', () => {
      expect(component.nationalitiesFormArray).toBeInstanceOf(FormArray);
      expect(component.nationalitiesFormArray).toBe(
        component.formGroup.get('nationalities'),
      );
    });

    describe('getDropdownValue', () => {
      it('should return the matching value for a known code', () => {
        const options = [
          { code: 1, value: 'Thai' },
          { code: 2, value: 'Foreigner' },
        ];

        expect(component.getDropdownValue(1, options)).toBe('Thai');
      });

      it('should return empty string for an unknown or null code', () => {
        const options = [{ code: 1, value: 'Thai' }];

        expect(component.getDropdownValue(99, options)).toBe('');
        expect(component.getDropdownValue(null, options)).toBe('');
      });
    });

    describe('nationalityOptions$', () => {
      it('should map the raw nationality options from the store into ValueCode form', () => {
        let result: unknown;
        const subscription = component.nationalityOptions$.subscribe(
          (options) => (result = options),
        );

        expect(result).toEqual([
          { value: 'Thai', code: 1 },
          { value: 'American', code: 2 },
        ]);
        subscription.unsubscribe();
      });
    });

    describe('addNationality', () => {
      it('should add a new row defaulted to the first loaded nationality option and not allowed', () => {
        const initialLength = component.nationalitiesFormArray.length;

        component.addNationality();

        expect(component.nationalitiesFormArray.length).toBe(
          initialLength + 1,
        );
        const newRow = component.nationalitiesFormArray.at(initialLength);
        expect(newRow.get('nationality')?.value).toBe(1);
        expect(newRow.get('allowed')?.value).toBe(false);
      });

      it('should add a row pre-filled with the provided value', () => {
        component.addNationality({ nationality: 2, allowed: true });

        const newRow = component.nationalitiesFormArray.at(
          component.nationalitiesFormArray.length - 1,
        );
        expect(newRow.get('nationality')?.value).toBe(2);
        expect(newRow.get('allowed')?.value).toBe(true);
      });
    });

    describe('removeNationality', () => {
      it('should remove the row at the given index', () => {
        component.addNationality({ nationality: 2, allowed: true });
        const initialLength = component.nationalitiesFormArray.length;

        component.removeNationality(0);

        expect(component.nationalitiesFormArray.length).toBe(
          initialLength - 1,
        );
      });
    });

    it('should reflect the assigned formMode', () => {
      component.formMode = 'view';
      expect(component.formMode).toBe('view');
    });
  });

  describe('ngOnInit', () => {
    it('should default the existing row nationality to the first option once options load in create mode', () => {
      createComponent({ formMode: 'create' });
      fixture.detectChanges();

      expect(
        component.nationalitiesFormArray.at(0).get('nationality')?.value,
      ).toBe(1);
    });

    it('should not touch existing rows while nationality options have not loaded yet', () => {
      createComponent({ formMode: 'create', nationalityOptionsValue: [] });
      fixture.detectChanges();

      expect(
        component.nationalitiesFormArray.at(0).get('nationality')?.value,
      ).toBe('');
    });

    it('should rebuild rows from fundTypeDetail when formMode is edit', () => {
      const fundTypeDetail: Partial<FundType> = {
        nationalities: [{ nationality_id: 2, allowed: true }],
      };
      createComponent({ formMode: 'edit', fundTypeDetail });
      fixture.detectChanges();

      expect(component.nationalitiesFormArray.length).toBe(1);
      expect(
        component.nationalitiesFormArray.at(0).get('nationality')?.value,
      ).toBe(2);
      expect(
        component.nationalitiesFormArray.at(0).get('allowed')?.value,
      ).toBe(true);
    });

    it('should disable the form group when formMode is view', () => {
      const fundTypeDetail: Partial<FundType> = {
        nationalities: [{ nationality_id: 1, allowed: false }],
      };
      createComponent({ formMode: 'view', fundTypeDetail });
      fixture.detectChanges();

      expect(component.formGroup.disabled).toBe(true);
    });

    it('should leave rows untouched when formMode is edit but fundTypeDetail is not yet loaded', () => {
      createComponent({ formMode: 'edit', fundTypeDetail: null });
      fixture.detectChanges();

      expect(component.nationalitiesFormArray.length).toBe(1);
      expect(
        component.nationalitiesFormArray.at(0).get('nationality')?.value,
      ).toBe('');
    });

    it('should clear all rows when fundTypeDetail has no nationalities', () => {
      createComponent({ formMode: 'edit', fundTypeDetail: {} });
      fixture.detectChanges();

      expect(component.nationalitiesFormArray.length).toBe(0);
    });
  });

  describe('addNationality before options load', () => {
    it('should default the nationality to an empty string when no options have loaded yet', () => {
      createComponent({ formMode: 'edit', nationalityOptionsValue: [] });
      fixture.detectChanges();

      component.addNationality();

      const newRow = component.nationalitiesFormArray.at(
        component.nationalitiesFormArray.length - 1,
      );
      expect(newRow.get('nationality')?.value).toBe('');
    });
  });
});
