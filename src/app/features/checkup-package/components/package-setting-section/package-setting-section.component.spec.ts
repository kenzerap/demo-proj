import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { PackageSettingSectionComponent } from './package-setting-section.component';

describe('PackageSettingSectionComponent', () => {
  let component: PackageSettingSectionComponent;
  let fixture: ComponentFixture<PackageSettingSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PackageSettingSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageSettingSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      name: ['', Validators.required, noSpacesValidatorAsync],
      description: ['', Validators.required, noSpacesValidatorAsync],
      published: [false],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get packageNameControl', () => {
    expect(component.packageNameControl).toBe(component.formGroup.get('name'));
  });

  it('should get descriptionControl', () => {
    expect(component.descriptionControl).toBe(
      component.formGroup.get('description')
    );
  });

  it('should get publishedControl', () => {
    expect(component.publishedControl).toBe(
      component.formGroup.get('published')
    );
  });

  it('should validate packageName as required', () => {
    component.packageNameControl?.setValue('');
    component.packageNameControl?.markAsTouched();
    fixture.detectChanges();
    expect(component.packageNameControl?.hasError('required')).toBe(true);
  });

  it('should validate description as required', () => {
    component.descriptionControl?.setValue('');
    component.descriptionControl?.markAsTouched();
    fixture.detectChanges();
    expect(component.descriptionControl?.hasError('required')).toBe(true);
  });

  it('should mark controls as touched when form is invalid', () => {
    component.packageNameControl?.setValue('');
    component.descriptionControl?.setValue('');
    component.formGroup.markAllAsTouched();
    expect(component.packageNameControl?.touched).toBe(true);
    expect(component.descriptionControl?.touched).toBe(true);
  });

  it('should validate noSpacesValidatorAsync for sectionName', async () => {
    component.packageNameControl?.setValue('   ');
    component.packageNameControl?.markAsTouched();
    fixture.detectChanges();
    // noSpacesValidatorAsync is async, so we need to wait for validation
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(component.packageNameControl?.errors).toBeTruthy();
  });

  it('should allow valid values for all controls', () => {
    component.packageNameControl?.setValue('Valid Name');
    component.descriptionControl?.setValue('Valid Description');
    component.publishedControl?.setValue(true);

    fixture.detectChanges();
    expect(component.formGroup.valid).toBe(true);
  });

  it('should patch form values and remain valid', () => {
    component.formGroup.patchValue({
      name: 'Package Name',
      description: 'Description',
      published: true,
    });
    expect(component.formGroup.valid).toBe(true);
  });

  it('should not be valid if required fields are missing', () => {
    component.formGroup.patchValue({
      name: '',
      description: '',
    });
    expect(component.formGroup.valid).toBe(false);
  });
});
