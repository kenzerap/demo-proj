import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DemoprojInputComponent } from '@app/shared/components/demoproj-input/demoproj-input.component';
import { SetSegmentType } from '../../enums/set-segment-type.enum';
import { EditorModule, EditorTextChangeEvent } from 'primeng/editor';

@Component({
  selector: 'app-cust-segment-base-detail-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    DemoprojInputComponent,
    MatDividerModule,
    MatButtonModule,
    EditorModule
  ],
  templateUrl: './cust-segment-base-detail-section.component.html',
  styleUrl: './cust-segment-base-detail-section.component.scss',
})
export class CustSegmentBaseDetailSectionComponent extends BaseComponent {
  private dialog = inject(MatDialog);

  @Input() formGroup!: FormGroup;
  @Input() isCreateMode: boolean = false;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';
  @Input() setSegmentTypeControl = new FormControl();
  @Output() formGroupChanged = new EventEmitter<FormGroup>();

  SetSegmentType: any = SetSegmentType;

  get segmentNameControl() {
    return this.formGroup?.get('name');
  }

  get segmentDescriptionControl() {
    return this.formGroup?.get('description');
  }
  get segmentDescriptionHtmlControl() {
    return this.formGroup?.get('description_html');
  }

  get segmentTypeControl() {
    return this.formGroup?.get('segment_type') as FormControl;
  }

  changeGroup(code: string) {
    this.segmentTypeControl.setValue(code);
  }

  editorTextChange(event: EditorTextChangeEvent) {
    this.segmentDescriptionControl?.setValue(event.textValue);
  }
}
