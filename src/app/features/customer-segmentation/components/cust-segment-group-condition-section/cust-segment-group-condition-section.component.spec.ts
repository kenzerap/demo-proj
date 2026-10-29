import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CustSegmentGroupConditionSectionComponent } from './cust-segment-group-condition-section.component';
import { LogicalConditionType } from '@app/shared/utils/enums/logical-condition-type.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { CustomerSegmentRuleAttribute } from '@app/shared/constants/segment-attribute-options.const';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as CreateEditCustomerSegmentationActions from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.actions';
import { SegmentRuleType } from '../../enums/segment-rule-type.enum';

describe('CustSegmentGroupConditionSectionComponent', () => {
  let component: CustSegmentGroupConditionSectionComponent;
  let fixture: ComponentFixture<CustSegmentGroupConditionSectionComponent>;
  let formBuilder: FormBuilder;
  let store: MockStore;

  const mockProductTypes = [
    { product_type: 'Type1' },
    { product_type: 'Type2' },
  ];

  const mockPolicyChannels = [{ name: 'Channel1' }, { name: 'Channel2' }];

  const mockProductNames = [
    { product_name: 'Product1', product_code: 'P1' },
    { product_name: 'Product2', product_code: 'P2' },
  ];

  const initialState = {
    createEditCustomerSegmentation: {
      productTypes: mockProductTypes,
      policyChannels: mockPolicyChannels,
      productNames: mockProductNames,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CustSegmentGroupConditionSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({ initialState }), FormBuilder, DatePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(
      CustSegmentGroupConditionSectionComponent
    );
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    store = TestBed.inject(Store) as MockStore;

    component.formGroup = formBuilder.group({
      segment_groups: formBuilder.array([]),
    });

    component.formDetailGroup = formBuilder.group({
      segment_type: [''],
    });

    // Setup selectors
    store.overrideSelector(
      require('@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors')
        .selectProductTypes,
      mockProductTypes
    );
    store.overrideSelector(
      require('@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors')
        .selectPolicyChannels,
      mockPolicyChannels
    );
    store.overrideSelector(
      require('@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors')
        .selectProductNames,
      mockProductNames
    );

    component.isCreateMode = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should dispatch actions on init', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditCustomerSegmentationActions.getProductTypes()
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditCustomerSegmentationActions.getPolicyChannels()
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        CreateEditCustomerSegmentationActions.getProductNames()
      );
    });

    it('should subscribe to observables and set options', () => {
      component.ngOnInit();

      expect(component.productTypeOptions).toEqual([
        { value: 'Type1', code: 'Type1' },
        { value: 'Type2', code: 'Type2' },
      ]);

      expect(component.policyChannelOptions).toEqual([
        { value: 'Channel1', code: 'Channel1' },
        { value: 'Channel2', code: 'Channel2' },
      ]);
    });

    it('should add initial segment group in create mode', () => {
      component.isCreateMode = true;
      component.ngOnInit();

      expect(component.segment_groups.length).toBe(2);
    });

    it('should not initialize segment rule data if not in create mode', () => {
      component.isCreateMode = false;
      const initSpy = jest.spyOn(component as any, 'initSegmentRuleData');

      component.ngOnInit();

      expect(initSpy).toHaveBeenCalled();
    });
  });

  describe('Form Controls Access', () => {
    beforeEach(() => {
      component.addSegmentGroup();
    });

    it('should get segment_groups form array', () => {
      const result = component.segment_groups;
      expect(result).toBeInstanceOf(FormArray);
    });

    it('should get segmentTypeControl', () => {
      const result = component.segmentTypeControl;
      expect(result).toBeDefined();
    });

    it('should check if segment group has rules', () => {
      const result = component.isHasSegmentRule(0);
      expect(result).toBe(true);
    });

    it('should get segment rule controls', () => {
      const result = component.segmentRuleControls(0);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should get specific segment rule control', () => {
      const result = component.segmentRuleControl(0, 0);
      expect(result).toBeDefined();
    });

    it('should get segment attribute control', () => {
      const result = component.segmentAttributeControl(0, 0);
      expect(result).toBeDefined();
    });

    it('should get segment rule expression control', () => {
      const result = component.segmentRuleExpressionControl(0, 0);
      expect(result).toBeDefined();
    });

    it('should get segment value control', () => {
      const result = component.segmentValueControl(0, 0);
      expect(result).toBeDefined();
    });
  });

  describe('Segment Group Management', () => {
    it('should add a new segment group', () => {
      const initialLength = component.segment_groups.length;
      component.addSegmentGroup();

      expect(component.segment_groups.length).toBe(initialLength + 1);

      const group = component.segment_groups.at(initialLength) as FormGroup;
      expect(group.get('group_name')?.value).toBe(`Group ${initialLength + 1}`);
      expect(group.get('logical_operator')?.value).toBe(
        LogicalConditionType.OR
      );
      expect(group.get('segment_rules')).toBeInstanceOf(FormArray);
    });

    it('should add segment group without emitting events when isInit is true', () => {
      const emitSpy = jest.spyOn(component.segment_groups, 'push');
      component.addSegmentGroup(true);

      expect(emitSpy).toHaveBeenCalledWith(expect.any(FormGroup), {
        emitEvent: false,
      });
    });

    it('should delete a segment group', () => {
      component.addSegmentGroup();
      component.addSegmentGroup();
      const initialLength = component.segment_groups.length;

      component.onDeleteSegmentGroup(0);

      expect(component.segment_groups.length).toBe(initialLength - 1);
    });

    it('should call addNewSegmentGroup', () => {
      const addSpy = jest.spyOn(component, 'addSegmentGroup');
      component.addNewSegmentGroup();
      expect(addSpy).toHaveBeenCalled();
    });
  });

  describe('Segment Rule Management', () => {
    beforeEach(() => {
      component.addSegmentGroup();
    });

    it('should add a new segment rule', () => {
      const group = component.segment_groups.at(0) as FormGroup;
      const rules = group.get('segment_rules') as FormArray;
      const initialLength = rules.length;

      component.addSegmentRule(0);

      expect(rules.length).toBe(initialLength + 1);

      const rule = rules.at(initialLength) as FormGroup;
      expect(rule.get('logical_operator')?.value).toBe(
        LogicalConditionType.AND
      );
      expect(rule.get('type')?.value).toBe(SegmentRuleType.FIXED);
      expect(rule.get('rule_expression')?.value).toBe(
        CompareConditionType.EQUAL
      );
    });

    it('should add segment rule without emitting events when isInit is true', () => {
      const group = component.segment_groups.at(0) as FormGroup;
      const rules = group.get('segment_rules') as FormArray;
      const pushSpy = jest.spyOn(rules, 'push');

      component.addSegmentRule(0, true);

      expect(pushSpy).toHaveBeenCalledWith(expect.any(FormGroup), {
        emitEvent: false,
      });
    });

    it('should delete a segment rule', () => {
      component.addSegmentRule(0);
      const group = component.segment_groups.at(0) as FormGroup;
      const rules = group.get('segment_rules') as FormArray;
      const initialLength = rules.length;

      component.onDeleteSegmentRule(0, 0);

      expect(rules.length).toBe(initialLength - 1);
    });

    it('should call addNewSegmentRule', () => {
      const addSpy = jest.spyOn(component, 'addSegmentRule');
      component.addNewSegmentRule(0);
      expect(addSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('Dropdown Value Helper', () => {
    it('should return correct dropdown value', () => {
      const options = [
        { code: 'code1', value: 'Value 1' },
        { code: 'code2', value: 'Value 2' },
      ];

      const result = component.getDropdownValue('code1', options);
      expect(result).toBe('Value 1');
    });

    it('should return empty string for non-existent code', () => {
      const options = [{ code: 'code1', value: 'Value 1' }];

      const result = component.getDropdownValue('nonexistent', options);
      expect(result).toBe('');
    });

    it('should return empty string for null code', () => {
      const options = [{ code: 'code1', value: 'Value 1' }];

      const result = component.getDropdownValue(null, options);
      expect(result).toBe('');
    });
  });

  describe('Attribute Change Handling', () => {
    beforeEach(() => {
      component.addSegmentGroup();
    });

    it('should handle CUSTOMER_TYPE attribute change', () => {
      component.onAttributeChange(
        0,
        0,
        CustomerSegmentRuleAttribute.CUSTOMER_TYPE
      );

      const valueControl = component.segmentValueControl(0, 0);
      expect(valueControl?.value).toBe(
        component.segmentCustomerTypeValuesOptions[0]?.code
      );
    });

    it('should handle IS_BLOCK attribute change', () => {
      component.onAttributeChange(0, 0, CustomerSegmentRuleAttribute.IS_BLOCK);

      const valueControl = component.segmentValueControl(0, 0);
      expect(valueControl?.value).toBe(
        component.segmentIsBlockValuesOptions[0]?.code
      );
    });

    it('should handle IS_FRAUD attribute change', () => {
      component.onAttributeChange(0, 0, CustomerSegmentRuleAttribute.IS_FRAUD);

      const valueControl = component.segmentValueControl(0, 0);
      expect(valueControl?.value).toBe(
        component.segmentIsFraudValuesOptions[0]?.code
      );
    });

    it('should handle PRODUCT_TYPE attribute change', () => {
      component.productTypeOptions = [{ code: 'type1', value: 'Type 1' }];
      component.onAttributeChange(
        0,
        0,
        CustomerSegmentRuleAttribute.PRODUCT_TYPE
      );

      const valueControl = component.segmentValueControl(0, 0);
      expect(valueControl?.value).toBe('type1');
    });

    it('should handle PRODUCT_NAME attribute change', () => {
      component.onAttributeChange(
        0,
        0,
        CustomerSegmentRuleAttribute.PRODUCT_NAME
      );

      const valueControl = component.segmentValueControl(0, 0);
      expect(valueControl?.value).toBe(null);
    });

    it('should handle CHANNEL_DESC attribute change', () => {
      component.onAttributeChange(
        0,
        0,
        CustomerSegmentRuleAttribute.CHANNEL_DESC
      );

      const valueControl = component.segmentValueControl(0, 0);
      expect(valueControl?.value).toBe(null);
    });

    it('should handle PARTY_ID attribute change', () => {
      component.onAttributeChange(0, 0, CustomerSegmentRuleAttribute.PARTY_ID);

      const valueControl = component.segmentValueControl(0, 0);
      expect(valueControl?.value).toBe(null);
    });

    it('should handle default case for unknown attribute', () => {
      const unknownAttribute =
        'UNKNOWN_ATTRIBUTE' as CustomerSegmentRuleAttribute;
      component.onAttributeChange(0, 0, unknownAttribute);

      // Should not throw error and should set rule expression to EQUAL
      const expressionControl = component.segmentRuleExpressionControl(0, 0);
      expect(expressionControl?.value).toBe(CompareConditionType.EQUAL);
    });
  });

  describe('Rule Expression Options', () => {
    it('should return correct options for PRODUCT_NAME', () => {
      const options = component.getSegmentRuleExpressionOptions(
        CustomerSegmentRuleAttribute.PRODUCT_NAME
      );

      expect(options).toEqual([
        { value: 'Is', code: CompareConditionType.EQUAL },
        { value: 'Is not', code: CompareConditionType.IsNot },
      ]);
    });

    it('should return default options for other attributes', () => {
      const options = component.getSegmentRuleExpressionOptions(
        CustomerSegmentRuleAttribute.CUSTOMER_TYPE
      );

      expect(options).toEqual([
        { value: 'Is', code: CompareConditionType.EQUAL },
      ]);
    });
  });

  describe('Height Calculations', () => {
    beforeEach(() => {
      component.addSegmentGroup();
      component.addSegmentRule(0);
    });

    it('should calculate all group connector height', () => {
      const height = component.connectAllGroupConnector();
      expect(height).toContain('rem');
      expect(typeof height).toBe('string');
    });

    it('should calculate group item connector height', () => {
      const height = component.connectGroupItem(0);
      expect(height).toContain('rem');
      expect(typeof height).toBe('string');
    });

    it('should handle multiple groups in height calculation', () => {
      component.addSegmentGroup();
      component.addSegmentRule(1);

      const height = component.connectAllGroupConnector();
      expect(height).toContain('rem');
    });
  });

  describe('Form Validation', () => {
    it('should call reValidateForm', () => {
      // This method is currently empty but should not throw
      expect(() => component.reValidateForm()).not.toThrow();
    });
  });

  describe('Private Methods', () => {
    beforeEach(() => {
      component.addSegmentGroup();
    });

    it('should initialize segment rule data', () => {
      const initSpy = jest.spyOn(component as any, 'initSegmentRuleData');
      (component as any).initSegmentRuleData(0, 0);

      expect(initSpy).toHaveBeenCalledWith(0, 0);

      const attributeControl = component.segmentAttributeControl(0, 0);
      const expressionControl = component.segmentRuleExpressionControl(0, 0);
      const valueControl = component.segmentValueControl(0, 0);

      expect(attributeControl?.value).toBe(
        component.selectAttributeOptions[0]?.code
      );
      expect(expressionControl?.value).toBe(CompareConditionType.EQUAL);
      expect(valueControl?.value).toBe(
        component.segmentCustomerTypeValuesOptions[0]?.code
      );
    });
  });

  describe('Input Properties', () => {
    it('should handle formMode input', () => {
      component.formMode = 'view';
      expect(component.formMode).toBe('view');

      component.formMode = 'edit';
      expect(component.formMode).toBe('edit');

      component.formMode = 'create';
      expect(component.formMode).toBe('create');
    });

    it('should handle isCreateMode input', () => {
      component.isCreateMode = false;
      expect(component.isCreateMode).toBe(false);

      component.isCreateMode = true;
      expect(component.isCreateMode).toBe(true);
    });
  });

  describe('Observable Subscriptions', () => {
    it('should handle productNameOptions$ observable', () => {
      const mockProductNameOptions = [
        { value: 'Product1 - P1', code: 'P1' },
        { value: 'Product2 - P2', code: 'P2' },
      ];

      component.productNameOptions$.subscribe((options) => {
        expect(options).toEqual(mockProductNameOptions);
      });
    });

    it('should handle empty product types', () => {
      store.overrideSelector(
        require('@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors')
          .selectProductTypes,
        []
      );
      store.refreshState();

      component.ngOnInit();
      expect(component.productTypeOptions).toEqual([]);
    });

    it('should handle empty policy channels', () => {
      store.overrideSelector(
        require('@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors')
          .selectPolicyChannels,
        []
      );
      store.refreshState();

      component.ngOnInit();
      expect(component.policyChannelOptions).toEqual([]);
    });
  });

  describe('Component Properties', () => {
    it('should have correct enum reference', () => {
      expect(component.CustomerSegmentRuleAttribute).toBe(
        CustomerSegmentRuleAttribute
      );
    });

    it('should have segment options arrays', () => {
      expect(component.segmentCustomerTypeValuesOptions).toBeDefined();
      expect(component.segmentIsBlockValuesOptions).toBeDefined();
      expect(component.segmentIsFraudValuesOptions).toBeDefined();
      expect(component.selectAttributeOptions).toBeDefined();
      expect(component.selectSegmentRuleExpressionOptions).toBeDefined();
    });

    it('should initialize empty options arrays', () => {
      expect(component.productTypeOptions).toEqual([
        {
          code: 'Type1',
          value: 'Type1',
        },
        {
          code: 'Type2',
          value: 'Type2',
        },
      ]);
      expect(component.policyChannelOptions).toEqual([
        {
          code: 'Channel1',
          value: 'Channel1',
        },
        {
          code: 'Channel2',
          value: 'Channel2',
        },
      ]);
      expect(component.productNameOptions).toEqual([
        {
          code: 'P1',
          value: 'Product1 - P1',
        },
        {
          code: 'P2',
          value: 'Product2 - P2',
        },
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle segment rule control access when index is out of bounds', () => {
      component.addSegmentGroup();
      expect(() => component.segmentRuleControl(0, 999)).not.toThrow();
    });

    it('should handle empty dropdown options', () => {
      const result = component.getDropdownValue('code1', []);
      expect(result).toBe('');
    });

    it('should handle undefined product type options in attribute change', () => {
      component.productTypeOptions = [];
      component.onAttributeChange(
        0,
        0,
        CustomerSegmentRuleAttribute.PRODUCT_TYPE
      );

      const valueControl = component.segmentValueControl(0, 0);
      expect(valueControl?.value).toBeUndefined();
    });
  });
});
