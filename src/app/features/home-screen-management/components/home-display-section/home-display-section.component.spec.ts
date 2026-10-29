import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDisplaySectionComponent } from './home-display-section.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeDisplaySectionComponent', () => {
  let component: HomeDisplaySectionComponent;
  let fixture: ComponentFixture<HomeDisplaySectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HomeDisplaySectionComponent,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDisplaySectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      title_th: ['', Validators.required],
      title_en: ['', Validators.required],
    });
    component.formMode = 'edit';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return titleEnControl', () => {
    expect(component.titleEnControl).toBe(component.formGroup.get('title_en'));
    // Check value assignment
    component.titleEnControl?.setValue('English Title');
    expect(component.titleEnControl?.value).toBe('English Title');
  });

  it('should return titleThControl', () => {
    expect(component.titleThControl).toBe(component.formGroup.get('title_th'));
    // Check value assignment
    component.titleThControl?.setValue('ชื่อไทย');
    expect(component.titleThControl?.value).toBe('ชื่อไทย');
  });

  it('should allow formMode input to be set', () => {
    component.formMode = 'view';
    expect(component.formMode).toBe('view');
    component.formMode = 'create';
    expect(component.formMode).toBe('create');
  });

  it('should handle missing formGroup gracefully', () => {
    component.formGroup = undefined as unknown as FormGroup;
    expect(component.titleEnControl).toBeUndefined();
    expect(component.titleThControl).toBeUndefined();
  });
});
