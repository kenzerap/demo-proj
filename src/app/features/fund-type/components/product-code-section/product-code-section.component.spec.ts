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
import { ProductCodeSectionComponent } from './product-code-section.component';
import * as CreateEditFundTypeSelectors from '../../stores/create-edit-fund-type/create-edit-fund-type.selectors';
import { FundType } from '../../models/fund-type.model';

describe('ProductCodeSectionComponent', () => {
  let component: ProductCodeSectionComponent;
  let fixture: ComponentFixture<ProductCodeSectionComponent>;
  let formBuilder: FormBuilder;

  const rawProductCodeOptions = [
    { product_code_id: 1, product_code: 'PC001' },
    { product_code_id: 2, product_code: 'PC002' },
  ];

  function createComponent(
    options: {
      formMode?: 'create' | 'edit' | 'view';
      fundTypeDetail?: Partial<FundType> | null;
      productCodeOptionsValue?: typeof rawProductCodeOptions;
    } = {},
  ) {
    TestBed.configureTestingModule({
      imports: [
        ProductCodeSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        provideMockStore({
          selectors: [
            {
              selector: CreateEditFundTypeSelectors.selectProductCodeOptions,
              value: options.productCodeOptionsValue ?? rawProductCodeOptions,
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

    fixture = TestBed.createComponent(ProductCodeSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      product_codes: formBuilder.array([
        formBuilder.group({ product_code: ['', Validators.required] }),
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

    it('should get productCodesFormArray', () => {
      expect(component.productCodesFormArray).toBeInstanceOf(FormArray);
      expect(component.productCodesFormArray).toBe(
        component.formGroup.get('product_codes'),
      );
    });

    describe('getDropdownValue', () => {
      it('should return the matching value for a known code', () => {
        const options = [
          { code: 1, value: 'PC001' },
          { code: 2, value: 'PC002' },
        ];

        expect(component.getDropdownValue(1, options)).toBe('PC001');
      });

      it('should return empty string for an unknown or null code', () => {
        const options = [{ code: 1, value: 'PC001' }];

        expect(component.getDropdownValue(99, options)).toBe('');
        expect(component.getDropdownValue(null, options)).toBe('');
      });
    });

    describe('productCodeOptions$', () => {
      it('should map the raw product code options from the store into ValueCode form', () => {
        let result: unknown;
        const subscription = component.productCodeOptions$.subscribe(
          (options) => (result = options),
        );

        expect(result).toEqual([
          { value: 'PC001', code: 1 },
          { value: 'PC002', code: 2 },
        ]);
        subscription.unsubscribe();
      });
    });

    describe('addProductCode', () => {
      it('should add a new row defaulted to the first loaded product code option', () => {
        const initialLength = component.productCodesFormArray.length;

        component.addProductCode();

        expect(component.productCodesFormArray.length).toBe(
          initialLength + 1,
        );
        const newRow = component.productCodesFormArray.at(initialLength);
        expect(newRow.get('product_code')?.value).toBe(1);
      });

      it('should add a row pre-filled with the provided value', () => {
        component.addProductCode({ product_code: 2 });

        const newRow = component.productCodesFormArray.at(
          component.productCodesFormArray.length - 1,
        );
        expect(newRow.get('product_code')?.value).toBe(2);
      });
    });

    describe('removeProductCode', () => {
      it('should remove the row at the given index', () => {
        component.addProductCode({ product_code: 2 });
        const initialLength = component.productCodesFormArray.length;

        component.removeProductCode(0);

        expect(component.productCodesFormArray.length).toBe(
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
    it('should default the existing row product code to the first option once options load in create mode', () => {
      createComponent({ formMode: 'create' });
      fixture.detectChanges();

      expect(
        component.productCodesFormArray.at(0).get('product_code')?.value,
      ).toBe(1);
    });

    it('should not touch existing rows while product code options have not loaded yet', () => {
      createComponent({ formMode: 'create', productCodeOptionsValue: [] });
      fixture.detectChanges();

      expect(
        component.productCodesFormArray.at(0).get('product_code')?.value,
      ).toBe('');
    });

    it('should rebuild rows from fundTypeDetail when formMode is edit', () => {
      const fundTypeDetail: Partial<FundType> = {
        product_codes: [2],
      };
      createComponent({ formMode: 'edit', fundTypeDetail });
      fixture.detectChanges();

      expect(component.productCodesFormArray.length).toBe(1);
      expect(
        component.productCodesFormArray.at(0).get('product_code')?.value,
      ).toBe(2);
    });

    it('should disable the form group when formMode is view', () => {
      const fundTypeDetail: Partial<FundType> = {
        product_codes: [1],
      };
      createComponent({ formMode: 'view', fundTypeDetail });
      fixture.detectChanges();

      expect(component.formGroup.disabled).toBe(true);
    });

    it('should leave rows untouched when formMode is edit but fundTypeDetail is not yet loaded', () => {
      createComponent({ formMode: 'edit', fundTypeDetail: null });
      fixture.detectChanges();

      expect(component.productCodesFormArray.length).toBe(1);
      expect(
        component.productCodesFormArray.at(0).get('product_code')?.value,
      ).toBe('');
    });

    it('should clear all rows when fundTypeDetail has no product_codes', () => {
      createComponent({ formMode: 'edit', fundTypeDetail: {} });
      fixture.detectChanges();

      expect(component.productCodesFormArray.length).toBe(0);
    });
  });

  describe('addProductCode before options load', () => {
    it('should default the product code to an empty string when no options have loaded yet', () => {
      createComponent({ formMode: 'edit', productCodeOptionsValue: [] });
      fixture.detectChanges();

      component.addProductCode();

      const newRow = component.productCodesFormArray.at(
        component.productCodesFormArray.length - 1,
      );
      expect(newRow.get('product_code')?.value).toBe('');
    });
  });
});
