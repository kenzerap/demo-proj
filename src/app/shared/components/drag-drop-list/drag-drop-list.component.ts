import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';

@Component({
  selector: 'app-drag-drop-list',
  standalone: true,
  imports: [
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
  ],
  templateUrl: './drag-drop-list.component.html',
  styleUrl: './drag-drop-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragDropListComponent {
  @Input() listItem: TierSegmentIncludeExclude[] = [];
  @Input() isEditable: boolean = true;
  @Output() reOrderItems = new EventEmitter<any>();
  @Output() onRemoveItem = new EventEmitter<any>();

  drop(event: CdkDragDrop<TierSegmentIncludeExclude[]>) {
    moveItemInArray(this.listItem, event.previousIndex, event.currentIndex);
    this.reOrderItems.emit(this.listItem);
  }

  removeItem(item: any) {
    if (!this.isEditable) {
      return;
    }

    this.onRemoveItem.emit(item);
  }
}
