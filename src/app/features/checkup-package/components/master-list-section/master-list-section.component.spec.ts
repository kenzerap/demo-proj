import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MasterListSectionComponent } from './master-list-section.component';

describe('MasterListSectionComponent', () => {
  let component: MasterListSectionComponent;
  let fixture: ComponentFixture<MasterListSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MasterListSectionComponent,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterListSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      package_name_th: ['', Validators.required],
      package_name_en: ['', Validators.required],
    });
    component.formMode = 'edit';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return nameEnControl', () => {
    expect(component.nameEnControl).toBe(
      component.formGroup.get('package_name_en')
    );
    // Check value assignment
    component.nameEnControl?.setValue('English Name');
    expect(component.nameEnControl?.value).toBe('English Name');
  });

  it('should return nameThControl', () => {
    expect(component.nameThControl).toBe(
      component.formGroup.get('package_name_th')
    );
    // Check value assignment
    component.nameThControl?.setValue('ชื่อไทย');
    expect(component.nameThControl?.value).toBe('ชื่อไทย');
  });

  it('should allow formMode input to be set', () => {
    component.formMode = 'view';
    expect(component.formMode).toBe('view');
    component.formMode = 'create';
    expect(component.formMode).toBe('create');
  });

  it('should handle missing formGroup gracefully', () => {
    component.formGroup = undefined as unknown as FormGroup;
    expect(component.nameEnControl).toBeUndefined();
    expect(component.nameThControl).toBeUndefined();
  });
});
