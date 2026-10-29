import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseSettingSectionComponent } from './base-setting-section.component';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BaseSettingSectionComponent', () => {
  let component: BaseSettingSectionComponent;
  let fixture: ComponentFixture<BaseSettingSectionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BaseSettingSectionComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        DemoprojInputComponent,
        NoopAnimationsModule
      ],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseSettingSectionComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      is_published: [false],
    });
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // test get nameControl()
  it('should return undefined if formGroup is undefined', () => {
    component.formGroup = undefined as unknown as FormGroup;
    expect(component.nameControl).toBeUndefined();
    expect(component.descriptionControl).toBeUndefined();
    expect(component.isPublishedControl).toBeUndefined();
  });

  it('should get nameControl', () => {
    expect(component.nameControl).toBe(component.formGroup.get('name'));
    component.nameControl?.setValue('Test Hospital');
    expect(component.nameControl?.value).toBe('Test Hospital');
  });

  it('should get descriptionControl', () => {
    expect(component.descriptionControl).toBe(
      component.formGroup.get('description')
    );
    component.descriptionControl?.setValue('desc');
    expect(component.descriptionControl?.value).toBe('desc');
  });

  it('should get isPublishedControl', () => {
    expect(component.isPublishedControl).toBe(
      component.formGroup.get('is_published')
    );
    component.isPublishedControl?.setValue(true);
    expect(component.isPublishedControl?.value).toBe(true);
  });

  it('should have default formMode as create', () => {
    expect(component.formMode).toBe('create');
    component.formMode = 'edit';
    expect(component.formMode).toBe('edit');
    component.formMode = 'view';
    expect(component.formMode).toBe('view');
  });

  it('should call ngOnInit without error', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
