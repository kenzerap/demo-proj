import {
  Directive,
  HostListener,
  HostBinding,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { Observable, take } from 'rxjs';
import { getImageSizeOser } from '../utils/get-image-size';

export interface FileDragDrop {
  file: File;
  size: { width: number; height: number } | null;
}

@Directive({
  selector: '[appDragDropUpload]',
  standalone: true,
})
export class DragDropUploadDirective {
  @Input() disabledDragDrop = false;
  @Output() fileDropped = new EventEmitter<FileDragDrop>();

  @HostBinding('class.bg-[#ccc]') isDragOver = false;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    if (this.disabledDragDrop) {
      return;
    }
    event.preventDefault();
    this.isDragOver = true;
  }

  @HostListener('dragleave')
  onDragLeave() {
    if (this.disabledDragDrop) {
      return;
    }
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    if (this.disabledDragDrop) {
      return;
    }

    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      getImageSizeOser(file)
        .pipe(take(1))
        .subscribe((size: { width: number; height: number } | null) => {
          this.fileDropped.emit({ file, size });
        });
    }
  }
}
