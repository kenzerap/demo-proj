import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BaseSettingSectionComponent } from './base-setting-section.component';

describe('BaseSettingSectionComponent', () => {
  let component: BaseSettingSectionComponent;
  let fixture: ComponentFixture<BaseSettingSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BaseSettingSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseSettingSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      isActive: [false],
      amcs: ['', Validators.required],
      fund_code_amcs: ['', Validators.required],
      fund_code_as400: ['', Validators.required],
      fund_th: ['', Validators.required],
      fund_en: ['', Validators.required],
      fund_type: ['', Validators.required],
      fund_type_th: [''],
      fund_type_mkt: [''],
      fund_class: [''],
      risk_level: ['', Validators.required],
      fx_rate_flag: [''],
      fx_hedging_prive: [''],
      fx_hedging_cep: [''],
      remark: [''],
    });
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default formMode as create', () => {
    expect(component.formMode).toBe('create');
    component.formMode = 'edit';
    expect(component.formMode).toBe('edit');
    component.formMode = 'view';
    expect(component.formMode).toBe('view');
  });

  it('should return undefined for every getter when formGroup is undefined', () => {
    component.formGroup = undefined as unknown as FormGroup;

    expect(component.isActiveControl).toBeUndefined();
    expect(component.amcsControl).toBeUndefined();
    expect(component.fundCodeAmcsControl).toBeUndefined();
    expect(component.fundCodeAs400Control).toBeUndefined();
    expect(component.fundThControl).toBeUndefined();
    expect(component.fundEnControl).toBeUndefined();
    expect(component.fundTypeControl).toBeUndefined();
    expect(component.fundTypeThControl).toBeUndefined();
    expect(component.fundTypeMktControl).toBeUndefined();
    expect(component.fundClassControl).toBeUndefined();
    expect(component.riskLevelControl).toBeUndefined();
    expect(component.fxRateFlagControl).toBeUndefined();
    expect(component.fxHedgingPriveControl).toBeUndefined();
    expect(component.fxHedgingCepControl).toBeUndefined();
    expect(component.remarkControl).toBeUndefined();
  });

  it('should get isActiveControl', () => {
    expect(component.isActiveControl).toBe(component.formGroup.get('isActive'));
    component.isActiveControl?.setValue(true);
    expect(component.isActiveControl?.value).toBe(true);
  });

  it('should get amcsControl', () => {
    expect(component.amcsControl).toBe(component.formGroup.get('amcs'));
    component.amcsControl?.setValue('AMCS1');
    expect(component.amcsControl?.value).toBe('AMCS1');
  });

  it('should get fundCodeAmcsControl', () => {
    expect(component.fundCodeAmcsControl).toBe(
      component.formGroup.get('fund_code_amcs')
    );
  });

  it('should get fundCodeAs400Control', () => {
    expect(component.fundCodeAs400Control).toBe(
      component.formGroup.get('fund_code_as400')
    );
  });

  it('should get fundThControl and fundEnControl', () => {
    expect(component.fundThControl).toBe(component.formGroup.get('fund_th'));
    expect(component.fundEnControl).toBe(component.formGroup.get('fund_en'));
  });

  it('should get fundTypeControl', () => {
    expect(component.fundTypeControl).toBe(
      component.formGroup.get('fund_type')
    );
  });

  it('should get fundTypeThControl and fundTypeMktControl', () => {
    expect(component.fundTypeThControl).toBe(
      component.formGroup.get('fund_type_th')
    );
    expect(component.fundTypeMktControl).toBe(
      component.formGroup.get('fund_type_mkt')
    );
  });

  it('should get fundClassControl', () => {
    expect(component.fundClassControl).toBe(
      component.formGroup.get('fund_class')
    );
  });

  it('should get riskLevelControl', () => {
    expect(component.riskLevelControl).toBe(
      component.formGroup.get('risk_level')
    );
  });

  it('should get fxRateFlagControl, fxHedgingPriveControl and fxHedgingCepControl', () => {
    expect(component.fxRateFlagControl).toBe(
      component.formGroup.get('fx_rate_flag')
    );
    expect(component.fxHedgingPriveControl).toBe(
      component.formGroup.get('fx_hedging_prive')
    );
    expect(component.fxHedgingCepControl).toBe(
      component.formGroup.get('fx_hedging_cep')
    );
  });

  it('should get remarkControl', () => {
    expect(component.remarkControl).toBe(component.formGroup.get('remark'));
  });

  it('should call ngOnInit without error', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  describe('getDropdownValue', () => {
    it('should return the matching value for a known code', () => {
      const options = [
        { code: 'A', value: 'Alpha' },
        { code: 'B', value: 'Beta' },
      ];

      expect(component.getDropdownValue('A', options)).toBe('Alpha');
    });

    it('should return empty string for an unknown or null code', () => {
      const options = [{ code: 'A', value: 'Alpha' }];

      expect(component.getDropdownValue('Z', options)).toBe('');
      expect(component.getDropdownValue(null, options)).toBe('');
    });
  });

  it('should require the mandatory fields', () => {
    expect(component.amcsControl?.hasError('required')).toBe(true);
    expect(component.fundCodeAmcsControl?.hasError('required')).toBe(true);
    expect(component.fundCodeAs400Control?.hasError('required')).toBe(true);
    expect(component.fundThControl?.hasError('required')).toBe(true);
    expect(component.fundEnControl?.hasError('required')).toBe(true);
    expect(component.fundTypeControl?.hasError('required')).toBe(true);
    expect(component.riskLevelControl?.hasError('required')).toBe(true);
  });
});
