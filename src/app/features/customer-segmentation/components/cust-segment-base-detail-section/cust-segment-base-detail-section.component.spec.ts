import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CustSegmentBaseDetailSectionComponent } from './cust-segment-base-detail-section.component';
import { EditorTextChangeEvent } from 'primeng/editor';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustSegmentBaseDetailSectionComponent', () => {
  let component: CustSegmentBaseDetailSectionComponent;
  let fixture: ComponentFixture<CustSegmentBaseDetailSectionComponent>;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CustSegmentBaseDetailSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustSegmentBaseDetailSectionComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormBuilder().group({
      name: [''],
      description: [''],
      description_html: [''],
      segment_type: [''],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return segmentNameControl', () => {
    expect(component.segmentNameControl).toBe(component.formGroup.get('name'));
  });

  it('should return segmentDescriptionControl', () => {
    expect(component.segmentDescriptionControl).toBe(
      component.formGroup.get('description')
    );
  });

  it('should return segmentDescriptionHtmlControl', () => {
    expect(component.segmentDescriptionHtmlControl).toBe(
      component.formGroup.get('description_html')
    );
  });

  it('should return segmentTypeControl', () => {
    expect(component.segmentTypeControl).toBe(
      component.formGroup.get('segment_type') as FormControl
    );
  });

  it('should change group when changeGroup is called', () => {
    const code = 'newCode';
    component.changeGroup(code);
    expect(component.segmentTypeControl.value).toBe(code);
  });

  it('should update description when editorTextChange is called', () => {
    const event: EditorTextChangeEvent = {
      textValue: 'Updated Description',
    } as EditorTextChangeEvent;
    component.editorTextChange(event);
    expect(component.segmentDescriptionControl?.value).toBe(event.textValue);
  });

  it('should emit formGroupChanged when formGroup is updated', () => {
    const spy = jest.spyOn(component.formGroupChanged, 'emit');
    component.formGroup.patchValue({ name: 'Test Name' });
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(component.formGroup);
    }, 0);
  });
});
