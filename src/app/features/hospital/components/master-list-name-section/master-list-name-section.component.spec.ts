import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterListNameSectionComponent } from './master-list-name-section.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MasterListNameSectionComponent', () => {
  let component: MasterListNameSectionComponent;
  let fixture: ComponentFixture<MasterListNameSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MasterListNameSectionComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        NoopAnimationsModule,
        DemoprojInputComponent,
      ],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterListNameSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      name_th: ['', Validators.required],
      name_en: ['', Validators.required],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return nameThControl', () => {
    expect(component.nameThControl).toBe(component.formGroup.get('name_th'));
    component.nameThControl?.setValue('ชื่อไทย');
    expect(component.nameThControl?.value).toBe('ชื่อไทย');
  });

  it('should return nameEnControl', () => {
    expect(component.nameEnControl).toBe(component.formGroup.get('name_en'));
    component.nameEnControl?.setValue('English Name');
    expect(component.nameEnControl?.value).toBe('English Name');
  });

  it('should allow formMode input to be set', () => {
    component.formMode = 'view';
    expect(component.formMode).toBe('view');
    component.formMode = 'create';
    expect(component.formMode).toBe('create');
    component.formMode = 'edit';
    expect(component.formMode).toBe('edit');
  });

  it('should handle undefined formGroup gracefully', () => {
    component.formGroup = undefined as unknown as FormGroup;
    expect(component.nameThControl).toBeUndefined();
    expect(component.nameEnControl).toBeUndefined();
  });

  it('should call ngOnInit without error', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
