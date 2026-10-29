import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RedeemSectionComponent } from './redeem-section.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RedeemSectionComponent', () => {
  let component: RedeemSectionComponent;
  let fixture: ComponentFixture<RedeemSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RedeemSectionComponent,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RedeemSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      value: ['', Validators.required],
      unit: ['', Validators.required],
      is_advance: [false],
      is_only_promotion_or_unicode: [false],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return valueControl', () => {
    expect(component.valueControl).toBe(component.formGroup.get('value'));
  });

  it('should return unitControl', () => {
    expect(component.unitControl).toBe(component.formGroup.get('unit'));
  });

  it('should return isAdvanceControl', () => {
    expect(component.isAdvanceControl).toBe(
      component.formGroup.get('is_advance')
    );
  });

  it('should return isOnlyPromotionOrUnicodeControl', () => {
    expect(component.isOnlyPromotionOrUnicodeControl).toBe(
      component.formGroup.get('is_only_promotion_or_unicode')
    );
  });

  it('should handle ngOnInit and disable valueControl when isOnlyPromotionOrUnicodeControl is true', () => {
    const valueControl = component.valueControl!;
    const isOnlyPromotionOrUnicodeControl =
      component.isOnlyPromotionOrUnicodeControl!;

    jest.spyOn(valueControl, 'patchValue');
    jest.spyOn(valueControl, 'disable');
    jest.spyOn(valueControl, 'enable');

    isOnlyPromotionOrUnicodeControl.setValue(true);
    component.ngOnInit();

    expect(valueControl.patchValue).toHaveBeenCalledWith(0);
    expect(valueControl.disable).toHaveBeenCalled();

    isOnlyPromotionOrUnicodeControl.setValue(false);
    expect(valueControl.enable).toHaveBeenCalled();
  });

  it('should return correct dropdown value', () => {
    const dropdownOptions: ValueCode[] = [
      { code: 'POINT', value: 'Point' },
      { code: 'CASH', value: 'Cash' },
    ];
    expect(component.getDropdownValue('POINT', dropdownOptions)).toBe('Point');
    expect(component.getDropdownValue('CASH', dropdownOptions)).toBe('Cash');
    expect(component.getDropdownValue('INVALID', dropdownOptions)).toBe('');
  });
});
