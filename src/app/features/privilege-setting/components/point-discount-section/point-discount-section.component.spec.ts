import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PointDiscountSectionComponent } from './point-discount-section.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PointDiscountSectionComponent', () => {
  let component: PointDiscountSectionComponent;
  let fixture: ComponentFixture<PointDiscountSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PointDiscountSectionComponent,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PointDiscountSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      value: ['', Validators.required],
      unit: ['', Validators.required],
      is_advance: [false],
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

  it('should return correct dropdown value', () => {
    const dropdownOptions: ValueCode[] = [
      { code: 'POINT', value: 'Point' },
      { code: 'CASH', value: 'Cash' },
    ];
    expect(component.getDropdownValue('POINT', dropdownOptions)).toBe('Point');
    expect(component.getDropdownValue('CASH', dropdownOptions)).toBe('Cash');
    expect(component.getDropdownValue('INVALID', dropdownOptions)).toBe('');
  });

  it('should handle ngOnInit', () => {
    component.ngOnInit();
    expect(component.formGroup).toBeDefined();
  });
});
