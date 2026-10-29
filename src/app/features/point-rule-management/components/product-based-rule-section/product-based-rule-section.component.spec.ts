import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ProductBasedRuleSectionComponent } from './product-based-rule-section.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { ProductName } from '@app/shared/models/product-name.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValueCode } from '@app/shared/models/value-code.model';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';

describe('ProductBasedRuleSectionComponent', () => {
  let component: ProductBasedRuleSectionComponent;
  let fixture: ComponentFixture<ProductBasedRuleSectionComponent>;
  let formBuilder: FormBuilder;
  let store: MockStore;
  let destroy$: Subject<void>;

  const mockPolicyChannels: PolicyChannel[] = [
    {
      system_id: 'SYS001',
      name: 'Online Channel',
      channel_code: 'ON',
    },
    {
      system_id: 'SYS002',
      name: 'Branch Channel',
      channel_code: 'BR',
    },
  ];

  const mockProductNames: ProductName[] = [
    {
      product_name: 'Product 1',
      product_code: 'P001',
      product_mkt_name_english: 'Marketing Product 1 EN',
      product_mkt_name_thai: 'Marketing Product 1 TH',
      free_look_period: 15,
    },
    {
      product_name: 'Product 2',
      product_code: 'P002',
      product_mkt_name_english: 'Marketing Product 2 EN',
      product_mkt_name_thai: 'Marketing Product 2 TH',
      free_look_period: 30,
    },
  ] as any[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ProductBasedRuleSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: createEditPointRuleSelectors.selectPointRuleDetail,
              value: null,
            },
            {
              selector: createEditPointRuleSelectors.selectPolicyChannels,
              value: mockPolicyChannels,
            },
            {
              selector: createEditPointRuleSelectors.selectProductNames,
              value: mockProductNames,
            },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductBasedRuleSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);
    destroy$ = new Subject<void>();

    component.formGroup = formBuilder.group({
      product_based_rule_id: [''],
      free_look_period: [''],
      product_name: ['', [Validators.required]],
      plan_code: [{ value: '', disabled: true }],
      marketing_name_en: [{ value: '', disabled: true }],
      marketing_name_th: [{ value: '', disabled: true }],
      channel_rules: formBuilder.array([
        formBuilder.group({
          product_based_rule_channel_id: [''],
          channel: ['', [Validators.required]],
          point_rate: [
            '',
            [Validators.required, Validators.min(0.01), Validators.max(999)],
          ],
        }),
      ]),
    });
    component.formMode = 'create';
    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Control Getters', () => {
    it('should get productNameControl', () => {
      expect(component.productNameControl).toBe(
        component.formGroup.get('product_name')
      );
    });

    it('should get planCodeControl', () => {
      expect(component.planCodeControl).toBe(
        component.formGroup.get('plan_code')
      );
    });

    it('should get marketingNameEnControl', () => {
      expect(component.marketingNameEnControl).toBe(
        component.formGroup.get('marketing_name_en')
      );
    });

    it('should get marketingNameThControl', () => {
      expect(component.marketingNameThControl).toBe(
        component.formGroup.get('marketing_name_th')
      );
    });

    it('should get freeLookPeriodControl', () => {
      expect(component.freeLookPeriodControl).toBe(
        component.formGroup.get('free_look_period')
      );
    });

    it('should get rulesFormArray', () => {
      expect(component.rulesFormArray).toBeInstanceOf(FormArray);
      expect(component.rulesFormArray).toBe(
        component.formGroup.get('channel_rules')
      );
    });
  });

  describe('Observable Properties', () => {
    it('should initialize channelOptions$ correctly', (done) => {
      component.channelOptions$.subscribe((options) => {
        expect(options).toEqual([
          {
            code: 'SYS001 - Online Channel (ON)',
            value: 'SYS001 - Online Channel (ON)',
          },
          {
            code: 'SYS002 - Branch Channel (BR)',
            value: 'SYS002 - Branch Channel (BR)',
          },
        ]);
        done();
      });
    });

    it('should initialize productNameOptions$ correctly', (done) => {
      component.productNameOptions$.subscribe((options) => {
        expect(options).toEqual([
          {
            code: 'Product 1 - P001',
            value: 'Product 1 - P001',
          },
          {
            code: 'Product 2 - P002',
            value: 'Product 2 - P002',
          },
        ]);
        done();
      });
    });

    it('should initialize pointRuleDetail$ correctly', (done) => {
      component.pointRuleDetail$.subscribe((detail) => {
        expect(detail).toBeNull();
        done();
      });
    });

    it('should initialize productNames$ correctly', (done) => {
      component.productNames$.subscribe((productNames) => {
        expect(productNames).toEqual(mockProductNames);
        done();
      });
    });
  });

  describe('ngOnInit', () => {
    it('should set productNames signal when productNames$ emits non-empty array', () => {
      component.productNames.set([]);
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.productNames()).toEqual(mockProductNames);
    });

    it('should not set productNames signal when productNames$ emits empty array', () => {
      store.overrideSelector(
        createEditPointRuleSelectors.selectProductNames,
        []
      );
      store.refreshState();

      const initialProductNames = [mockProductNames[0]];
      component.productNames.set(initialProductNames);
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.productNames()).toEqual(initialProductNames);
    });

    it('should subscribe to productNameControl valueChanges and update form controls', () => {
      component.ngOnInit();
      fixture.detectChanges();

      component.productNameControl?.setValue('Product 2 - P002');
      fixture.detectChanges();

      expect(component.planCodeControl?.value).toBe('P002');
      expect(component.marketingNameEnControl?.value).toBe(
        'Marketing Product 2 EN'
      );
      expect(component.marketingNameThControl?.value).toBe(
        'Marketing Product 2 TH'
      );
      expect(component.freeLookPeriodControl?.value).toBe(30);
    });

    it('should handle productNameControl valueChanges when product is not found', () => {
      component.ngOnInit();
      fixture.detectChanges();

      // Set initial values
      component.planCodeControl?.setValue('initial');
      component.marketingNameEnControl?.setValue('initial');
      component.marketingNameThControl?.setValue('initial');
      component.freeLookPeriodControl?.setValue('initial');

      component.productNameControl?.setValue('Non-existent Product - XXX');
      fixture.detectChanges();

      expect(component.planCodeControl?.value).toBe(undefined);
      expect(component.marketingNameEnControl?.value).toBe(undefined);
      expect(component.marketingNameThControl?.value).toBe(undefined);
      expect(component.freeLookPeriodControl?.value).toBe(undefined);
    });

    it('should handle productNameControl valueChanges when productNames is empty', () => {
      component.productNames.set([]);
      component.ngOnInit();
      fixture.detectChanges();

      component.productNameControl?.setValue('Product 1 - P001');
      fixture.detectChanges();

      expect(component.planCodeControl?.value).toBe('P001');
    });
  });

  describe('getDropdownValue', () => {
    it('should return correct value for existing code', () => {
      const options: ValueCode[] = [
        { code: 'A', value: 'Alpha' },
        { code: 'B', value: 'Beta' },
        { code: 'C', value: 'Gamma' },
      ];

      expect(component.getDropdownValue('A', options)).toBe('Alpha');
      expect(component.getDropdownValue('B', options)).toBe('Beta');
      expect(component.getDropdownValue('C', options)).toBe('Gamma');
    });

    it('should return empty string for non-existing code', () => {
      const options: ValueCode[] = [
        { code: 'A', value: 'Alpha' },
        { code: 'B', value: 'Beta' },
      ];

      expect(component.getDropdownValue('Z', options)).toBe('');
      expect(component.getDropdownValue('', options)).toBe('');
    });

    it('should return empty string for null code', () => {
      const options: ValueCode[] = [{ code: 'A', value: 'Alpha' }];

      expect(component.getDropdownValue(null, options)).toBe('');
    });

    it('should return empty string for empty options array', () => {
      expect(component.getDropdownValue('A', [])).toBe('');
    });
  });

  describe('addRule', () => {
    it('should add a new rule to rulesFormArray', () => {
      const initialLength = component.rulesFormArray.length;

      component.addRule();

      expect(component.rulesFormArray.length).toBe(initialLength + 1);

      const newRule = component.rulesFormArray.at(initialLength);
      expect(newRule.get('channel')?.value).toBe('');
      expect(newRule.get('point_rate')?.value).toBe('');

      // Check validators
      expect(newRule.get('channel')?.hasError('required')).toBe(true);
      expect(newRule.get('point_rate')?.hasError('required')).toBe(true);
    });

    it('should add multiple rules correctly', () => {
      const initialLength = component.rulesFormArray.length;

      component.addRule();
      component.addRule();
      component.addRule();

      expect(component.rulesFormArray.length).toBe(initialLength + 3);
    });
  });

  describe('removeCondition', () => {
    beforeEach(() => {
      // Add some rules to test removal
      component.addRule();
      component.addRule();
    });

    it('should remove rule at specified index', () => {
      const initialLength = component.rulesFormArray.length;

      component.removeCondition(1);

      expect(component.rulesFormArray.length).toBe(initialLength - 1);
    });

    it('should remove first rule', () => {
      const initialLength = component.rulesFormArray.length;

      component.removeCondition(0);

      expect(component.rulesFormArray.length).toBe(initialLength - 1);
    });

    it('should remove last rule', () => {
      const initialLength = component.rulesFormArray.length;
      const lastIndex = initialLength - 1;

      component.removeCondition(lastIndex);

      expect(component.rulesFormArray.length).toBe(initialLength - 1);
    });

    it('should handle removing from single rule array', () => {
      // Clear all rules first
      while (component.rulesFormArray.length > 0) {
        component.rulesFormArray.removeAt(0);
      }

      // Add one rule
      component.addRule();
      expect(component.rulesFormArray.length).toBe(1);

      component.removeCondition(0);
      expect(component.rulesFormArray.length).toBe(0);
    });
  });

  describe('Form Modes', () => {
    it('should handle create mode', () => {
      component.formMode = 'create';
      fixture.detectChanges();

      expect(component.formMode).toBe('create');
    });

    it('should handle edit mode', () => {
      component.formMode = 'edit';
      fixture.detectChanges();

      expect(component.formMode).toBe('edit');
    });

    it('should handle view mode', () => {
      component.formMode = 'view';
      fixture.detectChanges();

      expect(component.formMode).toBe('view');
    });
  });

  describe('Component Lifecycle', () => {
    it('should call ngOnDestroy and trigger destroy$ subject', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should unsubscribe from observables on destroy', () => {
      component.ngOnInit();

      const destroySpy = jest.spyOn(component['destroy$'], 'next');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('Product Name Parsing', () => {
    it('should correctly parse product name with dash separator', () => {
      component.ngOnInit();
      fixture.detectChanges();

      component.productNameControl?.setValue('Product 1 - P001');
      fixture.detectChanges();

      expect(component.planCodeControl?.value).toBe('P001');
    });

    it('should handle product name without dash separator', () => {
      component.ngOnInit();
      fixture.detectChanges();

      component.productNameControl?.setValue('Product1');
      fixture.detectChanges();

      expect(component.planCodeControl?.value).toBe(undefined);
    });

    it('should handle product name with multiple dashes', () => {
      const productWithMultipleDashes: ProductName = {
        product_name: 'Product - Special - Edition',
        product_code: 'P003',
        product_mkt_name_english: 'Special Edition EN',
        product_mkt_name_thai: 'Special Edition TH',
        free_look_period: 45,
      } as any;

      component.productNames.set([productWithMultipleDashes]);
      component.ngOnInit();
      fixture.detectChanges();

      component.productNameControl?.setValue(
        'Product - Special - Edition - P003'
      );
      fixture.detectChanges();

      expect(component.planCodeControl?.value).toBeUndefined();
    });
  });

  describe('Form Group Validation', () => {
    it('should validate required fields', () => {
      const productNameControl = component.productNameControl;
      const firstRuleChannelControl = component.rulesFormArray
        .at(0)
        .get('channel');
      const firstRulePointRateControl = component.rulesFormArray
        .at(0)
        .get('point_rate');

      expect(productNameControl?.hasError('required')).toBe(true);
      expect(firstRuleChannelControl?.hasError('required')).toBe(true);
      expect(firstRulePointRateControl?.hasError('required')).toBe(true);
    });

    it('should validate point_rate min/max constraints', () => {
      const firstRulePointRateControl = component.rulesFormArray
        .at(0)
        .get('point_rate');

      firstRulePointRateControl?.setValue(0.005); // Less than min
      expect(firstRulePointRateControl?.hasError('min')).toBe(true);

      firstRulePointRateControl?.setValue(1000); // Greater than max
      expect(firstRulePointRateControl?.hasError('max')).toBe(true);

      firstRulePointRateControl?.setValue(0.5); // Valid value
      expect(firstRulePointRateControl?.hasError('min')).toBe(false);
      expect(firstRulePointRateControl?.hasError('max')).toBe(false);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle productNames$ subscription error gracefully', () => {
      const errorProductNames$ = new Subject<ProductName[]>();
      component.productNames$ = errorProductNames$.asObservable();

      expect(() => {
        component.ngOnInit();
        errorProductNames$.error('Test error');
      }).not.toThrow();
    });

    it('should handle productNameControl valueChanges error gracefully', () => {
      component.ngOnInit();

      expect(() => {
        component.productNameControl?.setValue(null);
      }).not.toThrow();
    });
  });

  describe('Store Selectors', () => {
    it('should handle empty policy channels', (done) => {
      store.overrideSelector(
        createEditPointRuleSelectors.selectPolicyChannels,
        []
      );
      store.refreshState();

      component.channelOptions$.subscribe((options) => {
        expect(options).toEqual([]);
        done();
      });
    });

    it('should handle policy channels with missing properties', (done) => {
      const incompletePolicyChannels = [
        {
          system_id: 'SYS001',
          name: 'Test Channel',
          // missing channel_code
        } as PolicyChannel,
      ];

      store.overrideSelector(
        createEditPointRuleSelectors.selectPolicyChannels,
        incompletePolicyChannels
      );
      store.refreshState();

      component.channelOptions$.subscribe((options) => {
        expect(options[0].value).toContain('Test Channel');
        done();
      });
    });
  });
});
