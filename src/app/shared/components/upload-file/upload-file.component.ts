import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  DragDropUploadDirective,
  FileDragDrop,
} from '@app/shared/directives/drag-drop-upload.directive';
import { SvgDefaultImageComponent } from '../../icons/svg-default-image/svg-default-image.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [
    CommonModule,
    DragDropUploadDirective,
    SvgDefaultImageComponent,
    MatDividerModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent {
  @Input() disabledDragDrop = false;
  @Input() imageNameUploaded = 'Upload file';
  @Input() isRequireError = false;
  @Input() fileAccept = '.svg,.png,.jpg,.jpeg,.gif';
  @Input() description = 'SVG, PNG, JPG or GIF (343 x 495 px)';
  @Input() isReview = false;
  @Input() reviewImageUrl = '';

  @Output() fileDropped = new EventEmitter<FileDragDrop>();
  @Output() fileSelected = new EventEmitter<Event>();

  onFileDropped(fileDragDrop: FileDragDrop) {
    this.fileDropped.emit(fileDragDrop);
  }

  onFileSelected(event: Event) {
    this.fileSelected.emit(event);
  }
}
