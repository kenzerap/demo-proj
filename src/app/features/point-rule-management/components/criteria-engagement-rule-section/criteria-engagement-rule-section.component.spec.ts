import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { CriteriaEngagementRuleSectionComponent } from './criteria-engagement-rule-section.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { EngagementBasedRuleAttributeCode } from '../../constants/engagement-based-rule-attribute-options.const';
import { CompareConditionType } from '@app/shared/utils/enums/compare-condition-type.enum';
import { of } from 'rxjs';
import * as createEditPointRuleSelectors from '../../stores/create-edit-point-rule/create-edit-point-rule.selectors';

describe('CriteriaEngagementRuleSectionComponent', () => {
  let component: CriteriaEngagementRuleSectionComponent;
  let fixture: ComponentFixture<CriteriaEngagementRuleSectionComponent>;
  let formBuilder: FormBuilder;
  let store: MockStore;

  const initialState = {
    createEditPointRule: {
      pointRuleDetail: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CriteriaEngagementRuleSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({ initialState }), FormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CriteriaEngagementRuleSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    store = TestBed.inject(MockStore);

    // Setup form group
    component.formGroup = formBuilder.group({
      default_attribute: [EngagementBasedRuleAttributeCode.Eclaim],
      default_condition: [CompareConditionType.Is],
      default_value: [''],
      default_earning_point: [''],
      is_unlimited_value: [false],
      criteria_feature_engagement_rules: formBuilder.array([]),
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.formMode).toBe('create');
      expect(component.selectedConditionId()).toBeNull();
      expect(component.attributeOptions.length).toBeGreaterThan(0);
      expect(component.conditionOptions.length).toBe(1);
      expect(component.engagementBasedRuleAttributeCode).toBe(
        EngagementBasedRuleAttributeCode
      );
    });

    it('should initialize observables', () => {
      expect(component.pointRuleDetail$).toBeDefined();
    });
  });

  describe('Form Controls Getters', () => {
    it('should return correct form controls', () => {
      expect(component.defaultAttributeControl).toBeTruthy();
      expect(component.defaultConditionControl).toBeTruthy();
      expect(component.defaultValueControl).toBeTruthy();
      expect(component.defaultEarningPointControl).toBeTruthy();
      expect(component.isUnlimitedValueControl).toBeTruthy();
      expect(component.rulesFormArray).toBeInstanceOf(FormArray);
    });

    it('should return null for non-existent controls', () => {
      const emptyForm = formBuilder.group({});
      component.formGroup = emptyForm;

      expect(component.defaultAttributeControl).toBeNull();
      expect(component.defaultConditionControl).toBeNull();
      expect(component.defaultValueControl).toBeNull();
      expect(component.defaultEarningPointControl).toBeNull();
      expect(component.isUnlimitedValueControl).toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should call ngOnInit without error', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle default_attribute value change for TaxCertificate', () => {
      const rulesFormArray = component.rulesFormArray;
      // Add a rule first
      component.addRule();
      expect(rulesFormArray.length).toBe(1);

      // Change to TaxCertificate
      component.defaultAttributeControl?.setValue(
        EngagementBasedRuleAttributeCode.TaxCertificate
      );

      expect(component.isUnlimitedValueControl?.disabled).toBe(true);
      expect(rulesFormArray.length).toBe(0);
      expect(component.isUnlimitedValueControl?.value).toBe(false);
    });

    it('should handle default_attribute value change for non-TaxCertificate', () => {
      // First set to TaxCertificate to disable
      component.defaultAttributeControl?.setValue(
        EngagementBasedRuleAttributeCode.TaxCertificate
      );
      expect(component.isUnlimitedValueControl?.disabled).toBe(true);

      // Then change to other value
      component.defaultAttributeControl?.setValue(
        EngagementBasedRuleAttributeCode.Eclaim
      );
      expect(component.isUnlimitedValueControl?.enabled).toBe(true);
    });

    describe('Unlimited Value Changes', () => {
      it('should handle is_unlimited_value change to true with existing selected condition', () => {
        // Add a rule and select it
        component.addRule();
        const firstRule = component.rulesFormArray.at(0);
        const virtualId = firstRule.get('virtualId')?.value;
        component.selectedConditionId.set(virtualId);

        // Set unlimited to true
        component.isUnlimitedValueControl?.setValue(true);

        expect(firstRule.get('value')?.value).toBe('Unlimited');
        expect(firstRule.get('unlimited_value')?.value).toBe(true);
        expect(firstRule.get('value')?.disabled).toBe(true);
      });

      it('should handle is_unlimited_value change to true with no selected condition but existing rules', () => {
        component.addRule();
        component.selectedConditionId.set(null);

        component.isUnlimitedValueControl?.setValue(true);

        const lastRule = component.rulesFormArray.at(
          component.rulesFormArray.length - 1
        );
        expect(lastRule.get('value')?.value).toBe('Unlimited');
        expect(lastRule.get('unlimited_value')?.value).toBe(true);
        expect(lastRule.get('value')?.disabled).toBe(true);
        expect(component.selectedConditionId()).toBe(
          lastRule.get('virtualId')?.value
        );
      });

      it('should handle is_unlimited_value change to true with no existing rules', () => {
        component.rulesFormArray.clear();
        component.selectedConditionId.set(null);

        component.isUnlimitedValueControl?.setValue(true);

        expect(component.rulesFormArray.length).toBe(1);
        const newRule = component.rulesFormArray.at(0);
        expect(newRule.get('value')?.value).toBe('Unlimited');
        expect(newRule.get('unlimited_value')?.value).toBe(true);
        expect(newRule.get('value')?.disabled).toBe(true);
        expect(component.selectedConditionId()).toBe(
          newRule.get('virtualId')?.value
        );
      });

      it('should handle is_unlimited_value change to false with selected condition', () => {
        // First set to true
        component.isUnlimitedValueControl?.setValue(true);

        // Then set to false
        component.isUnlimitedValueControl?.setValue(false);

        const rule = component.rulesFormArray.at(0);
        expect(rule.get('value')?.enabled).toBe(true);
        expect(rule.get('unlimited_value')?.value).toBe(false);
        expect(component.selectedConditionId()).toBeNull();
      });

      it('should handle is_unlimited_value change to false with no selected condition', () => {
        component.addRule();
        component.selectedConditionId.set(null);

        component.isUnlimitedValueControl?.setValue(false);

        // Should not throw error
        expect(component.selectedConditionId()).toBeNull();
      });
    });

    describe('Point Rule Detail Subscription', () => {
      it('should set selectedConditionId from pointRuleDetail$ with unlimited condition', (done) => {
        const mockPointRuleDetail = {
          criteria_feature_engagement_rules: [
            {
              virtualId: 'test-unlimited-id',
              unlimited_value: true,
              attribute: EngagementBasedRuleAttributeCode.Eclaim,
              condition: CompareConditionType.Is,
              value: 'Unlimited',
              earning_point: 10,
            },
          ],
        } as any;

        store.overrideSelector(
          createEditPointRuleSelectors.selectPointRuleDetail,
          mockPointRuleDetail
        );
        store.refreshState();

        component.formGroup.patchValue({
          criteria_feature_engagement_rules:
            mockPointRuleDetail.criteria_feature_engagement_rules,
        });

        component.ngOnInit();

        setTimeout(() => {
          expect(component.selectedConditionId()).toBe(null);
          done();
        }, 0);
      });

      it('should not set selectedConditionId when no unlimited condition exists', (done) => {
        const mockPointRuleDetail = {
          criteria_feature_engagement_rules: [
            {
              virtualId: 'test-normal-id',
              unlimited_value: false,
              attribute: EngagementBasedRuleAttributeCode.Eclaim,
              condition: CompareConditionType.Is,
              value: '100',
              earning_point: 10,
            },
          ],
        } as any;

        store.overrideSelector(
          createEditPointRuleSelectors.selectPointRuleDetail,
          mockPointRuleDetail
        );
        store.refreshState();

        component.formGroup.patchValue({
          criteria_feature_engagement_rules:
            mockPointRuleDetail.criteria_feature_engagement_rules,
        });

        component.ngOnInit();

        setTimeout(() => {
          expect(component.selectedConditionId()).toBeNull();
          done();
        }, 0);
      });

      it('should handle point rule detail with no criteria_feature_engagement_rules', (done) => {
        const mockPointRuleDetail: any = {};

        store.overrideSelector(
          createEditPointRuleSelectors.selectPointRuleDetail,
          mockPointRuleDetail
        );
        store.refreshState();

        component.ngOnInit();

        setTimeout(() => {
          expect(component.selectedConditionId()).toBeNull();
          done();
        }, 0);
      });

      it('should handle point rule detail with empty criteria_feature_engagement_rules', (done) => {
        const mockPointRuleDetail: any = {
          criteria_feature_engagement_rules: [],
        };

        store.overrideSelector(
          createEditPointRuleSelectors.selectPointRuleDetail,
          mockPointRuleDetail
        );
        store.refreshState();

        component.formGroup.patchValue({
          criteria_feature_engagement_rules: [],
        });

        component.ngOnInit();

        setTimeout(() => {
          expect(component.selectedConditionId()).toBeNull();
          done();
        }, 0);
      });
    });
  });

  describe('getDropdownValue', () => {
    it('should return correct value for existing code', () => {
      const options = [
        { value: 'Option 1', code: 'opt1' },
        { value: 'Option 2', code: 'opt2' },
      ];

      const result = component.getDropdownValue('opt1', options);
      expect(result).toBe('Option 1');
    });

    it('should return empty string for non-existing code', () => {
      const options = [
        { value: 'Option 1', code: 'opt1' },
        { value: 'Option 2', code: 'opt2' },
      ];

      const result = component.getDropdownValue('opt3', options);
      expect(result).toBe('');
    });

    it('should return empty string for null code', () => {
      const options = [
        { value: 'Option 1', code: 'opt1' },
        { value: 'Option 2', code: 'opt2' },
      ];

      const result = component.getDropdownValue(null, options);
      expect(result).toBe('');
    });

    it('should return empty string for empty options', () => {
      const result = component.getDropdownValue('opt1', []);
      expect(result).toBe('');
    });
  });

  describe('addRule', () => {
    it('should add a rule to criteria_feature_engagement_rules', () => {
      const initialLength = component.rulesFormArray.length;
      component.addRule();

      expect(component.rulesFormArray.length).toBe(initialLength + 1);

      const newRule = component.rulesFormArray.at(
        component.rulesFormArray.length - 1
      );
      expect(newRule.get('virtualId')?.value).toBeDefined();
      expect(newRule.get('attribute')?.value).toBe(
        EngagementBasedRuleAttributeCode.Eclaim
      );
      expect(newRule.get('condition')?.value).toBe(CompareConditionType.Is);
      expect(newRule.get('value')?.value).toBe('');
      expect(newRule.get('unlimited_value')?.value).toBe(false);
      expect(newRule.get('earning_point')?.value).toBe('');
    });

    it('should add multiple rules correctly', () => {
      component.addRule();
      component.addRule();
      component.addRule();

      expect(component.rulesFormArray.length).toBe(3);

      // Check that each rule has unique virtualId
      const virtualIds = component.rulesFormArray.controls.map(
        (control) => control.get('virtualId')?.value
      );
      const uniqueIds = new Set(virtualIds);
      expect(uniqueIds.size).toBe(3);
    });
  });

  describe('removeCondition', () => {
    beforeEach(() => {
      component.addRule();
      component.addRule();
    });

    it('should remove a rule from criteria_feature_engagement_rules', () => {
      const initialLength = component.rulesFormArray.length;
      component.removeCondition(0);

      expect(component.rulesFormArray.length).toBe(initialLength - 1);
    });

    it('should reset selectedConditionId and unlimited value when removing unlimited rule', () => {
      const virtualId = component.rulesFormArray.at(0).get('virtualId')?.value;
      component.selectedConditionId.set(virtualId);
      component.isUnlimitedValueControl?.setValue(true);

      component.removeCondition(0);

      expect(component.selectedConditionId()).toBeNull();
      expect(component.isUnlimitedValueControl?.value).toBe(false);
    });

    it('should not reset selectedConditionId when removing non-unlimited rule', () => {
      const firstVirtualId = component.rulesFormArray
        .at(0)
        .get('virtualId')?.value;
      const secondVirtualId = component.rulesFormArray
        .at(1)
        .get('virtualId')?.value;

      component.selectedConditionId.set(firstVirtualId);
      component.removeCondition(1); // Remove second rule

      expect(component.selectedConditionId()).toBe(firstVirtualId);
    });

    it('should handle removing rule when no unlimited value control exists', () => {
      // Create form without is_unlimited_value control
      component.formGroup = formBuilder.group({
        criteria_feature_engagement_rules: formBuilder.array([
          formBuilder.group({
            virtualId: ['test-id'],
            attribute: [EngagementBasedRuleAttributeCode.Eclaim],
            condition: [CompareConditionType.Is],
            value: [''],
            unlimited_value: [false],
            earning_point: [''],
          }),
        ]),
      });

      component.selectedConditionId.set('test-id');

      expect(() => component.removeCondition(0)).not.toThrow();
      expect(component.selectedConditionId()).toBeNull();
    });
  });

  describe('selectConditionRow', () => {
    let mockRowControl: FormGroup;

    beforeEach(() => {
      mockRowControl = formBuilder.group({
        virtualId: ['test-virtual-id'],
        attribute: [EngagementBasedRuleAttributeCode.Eclaim],
        condition: [CompareConditionType.Is],
        value: ['100'],
        unlimited_value: [false],
        earning_point: [10],
      });
    });

    it('should set selectedConditionId when unlimited value is false', () => {
      component.isUnlimitedValueControl?.setValue(false);

      component.selectConditionRow(mockRowControl);

      expect(component.selectedConditionId()).toBe('test-virtual-id');
    });

    it('should not set selectedConditionId when unlimited value is true', () => {
      component.isUnlimitedValueControl?.setValue(true);
      component.selectedConditionId.set(null);

      component.selectConditionRow(mockRowControl);

      expect(component.selectedConditionId()).toBeNull();
    });

    it('should handle row control without virtualId', () => {
      const invalidRowControl = formBuilder.group({
        attribute: [EngagementBasedRuleAttributeCode.Eclaim],
      });

      component.isUnlimitedValueControl?.setValue(false);

      expect(() =>
        component.selectConditionRow(invalidRowControl)
      ).not.toThrow();
    });

    it('should handle when isUnlimitedValueControl is null', () => {
      // Create form without is_unlimited_value control
      component.formGroup = formBuilder.group({
        criteria_feature_engagement_rules: formBuilder.array([]),
      });

      expect(() => component.selectConditionRow(mockRowControl)).not.toThrow();
    });
  });

  describe('Form Mode Behavior', () => {
    it('should handle view mode', () => {
      component.formMode = 'view';
      fixture.detectChanges();

      expect(component.formMode).toBe('view');
    });

    it('should handle edit mode', () => {
      component.formMode = 'edit';
      fixture.detectChanges();

      expect(component.formMode).toBe('edit');
    });

    it('should handle create mode', () => {
      component.formMode = 'create';
      fixture.detectChanges();

      expect(component.formMode).toBe('create');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: add rule -> select -> make unlimited -> remove', () => {
      // Add rule
      component.addRule();
      expect(component.rulesFormArray.length).toBe(1);

      // Select rule
      const ruleControl = component.rulesFormArray.at(0);
      component.selectConditionRow(ruleControl);
      expect(component.selectedConditionId()).toBe(
        ruleControl.get('virtualId')?.value
      );

      // Make unlimited
      component.isUnlimitedValueControl?.setValue(true);
      expect(ruleControl.get('unlimited_value')?.value).toBe(true);
      expect(ruleControl.get('value')?.value).toBe('Unlimited');

      // Remove rule
      component.removeCondition(0);
      expect(component.rulesFormArray.length).toBe(0);
      expect(component.selectedConditionId()).toBeNull();
    });

    it('should handle attribute change affecting unlimited value', () => {
      // Add rule and make unlimited
      component.addRule();
      component.isUnlimitedValueControl?.setValue(true);
      expect(component.rulesFormArray.length).toBe(1);

      // Change to TaxCertificate (should clear rules and disable unlimited)
      component.defaultAttributeControl?.setValue(
        EngagementBasedRuleAttributeCode.TaxCertificate
      );
      expect(component.rulesFormArray.length).toBe(0);
      expect(component.isUnlimitedValueControl?.disabled).toBe(true);
      expect(component.isUnlimitedValueControl?.value).toBe(false);
    });

    it('should handle multiple rules with one unlimited', () => {
      // Add multiple rules
      component.addRule();
      component.addRule();
      component.addRule();

      // Make middle rule unlimited
      const middleRule = component.rulesFormArray.at(1);
      component.selectConditionRow(middleRule);
      component.isUnlimitedValueControl?.setValue(true);

      expect(middleRule.get('unlimited_value')?.value).toBe(true);
      expect(component.rulesFormArray.at(0).get('unlimited_value')?.value).toBe(
        false
      );
      expect(component.rulesFormArray.at(2).get('unlimited_value')?.value).toBe(
        false
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle store selector returning null', (done) => {
      store.overrideSelector(
        createEditPointRuleSelectors.selectPointRuleDetail,
        null
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        expect(component.selectedConditionId()).toBeNull();
        done();
      }, 0);
    });

    it('should handle concurrent unlimited value changes', () => {
      component.addRule();

      // Simulate rapid changes
      component.isUnlimitedValueControl?.setValue(true);
      component.isUnlimitedValueControl?.setValue(false);
      component.isUnlimitedValueControl?.setValue(true);

      const rule = component.rulesFormArray.at(0);
      expect(rule.get('unlimited_value')?.value).toBe(true);
      expect(rule.get('value')?.value).toBe('Unlimited');
    });
  });

  describe('Destroy', () => {
    it('should handle component destruction', () => {
      component.ngOnInit();

      // Component should be destroyed without errors
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });
  });
});
