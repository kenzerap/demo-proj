import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TargetGroupIconComponent } from '../target-group-icon/target-group-icon.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerSegmentationTierDialogComponent } from '../add-customer-segmentation-tier-dialog/add-customer-segmentation-tier-dialog.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { takeUntil } from 'rxjs';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import { TargetGroupType } from './target-group-type.enum';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-target-group-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    TargetGroupIconComponent,
    MatDividerModule,
    SvgPlusComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
  ],
  templateUrl: './target-group-section.component.html',
  styleUrl: './target-group-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetGroupSectionComponent extends BaseComponent {
  private dialog = inject(MatDialog);

  @Input() formGroup!: FormGroup;
  @Input() tierGroups: TierGroup[] = [];
  @Input() segmentGroups: SegmentGroup[] = [];
  @Input() isEditable: boolean = true;

  _tierSegmentIncludeExclude: TierSegmentIncludeExclude[] = [];
  @Input() set tierSegmentIncludeExclude(value: TierSegmentIncludeExclude[]) {
    this._tierSegmentIncludeExclude = value;
    this.includeGroups.set(value.filter((item) => item.isInclude));
    this.excludeGroups.set(value.filter((item) => !item.isInclude));
  }

  @Output() includeExcludelistChange: EventEmitter<
    TierSegmentIncludeExclude[]
  > = new EventEmitter<TierSegmentIncludeExclude[]>();

  targetGroupType = TargetGroupType;
  includeGroups: WritableSignal<TierSegmentIncludeExclude[]> = signal([]);
  excludeGroups: WritableSignal<TierSegmentIncludeExclude[]> = signal([]);

  get targetGroupTypeControl() {
    return this.formGroup?.get('target_group_type') as FormControl;
  }

  openAddTargetGroupDialog() {
    const ref = this.dialog.open(AddCustomerSegmentationTierDialogComponent, {
      data: {
        tierGroups: this.tierGroups,
        segmentGroups: this.segmentGroups,
        data: [...this.includeGroups(), ...this.excludeGroups()],
      },
      autoFocus: false,
      width: '55rem',
      disableClose: true,
    });

    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: TierSegmentIncludeExclude[]) => {
        if (result) {
          let includeGroups: TierSegmentIncludeExclude[] = [];
          let excludeGroups: TierSegmentIncludeExclude[] = [];
          result.forEach((group) => {
            if (group.isInclude) {
              includeGroups.push(group);
            } else {
              excludeGroups.push(group);
            }
          });

          this.includeGroups.set(includeGroups);
          this.excludeGroups.set(excludeGroups);

          this.includeExcludelistChange.emit([
            ...this.includeGroups(),
            ...this.excludeGroups(),
          ]);
          this.formGroup.markAllAsTouched();
        }
      });
  }

  removeItem(event: any, type: 'includeGroups' | 'excludeGroups') {
    if (!this.isEditable) {
      return;
    }

    if (type === 'includeGroups') {
      this.includeGroups.update((items) => {
        return items.filter(
          (item) => item.id !== event.id || item.type !== event.type
        );
      });
    } else if (type === 'excludeGroups') {
      this.excludeGroups.update((items) => {
        return items.filter(
          (item) => item.id !== event.id || item.type !== event.type
        );
      });
    }

    this.emitItems();
  }

  emitItems() {
    this.includeExcludelistChange.emit([
      ...this.includeGroups(),
      ...this.excludeGroups(),
    ]);
    this.formGroup.markAllAsTouched();
  }

  drop(event: CdkDragDrop<TierSegmentIncludeExclude[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const newIncludeGroups = this.includeGroups().map((item) => ({
      ...item,
      isInclude: true,
    }));
    const newExcludeGroups = this.excludeGroups().map((item) => ({
      ...item,
      isInclude: false,
    }));
    this.includeGroups.set(newIncludeGroups);
    this.excludeGroups.set(newExcludeGroups);
    this.emitItems();
  }
}
