import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { addCustomerSegmentationTierTabs } from './add-customer-segmentation-tier-tabs.const';
import { ValueCode } from '@app/shared/models/value-code.model';
import { DemoprojTableComponent } from '../demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { segmentationListColumns } from '../../constants/segmentation-list-columns.const';
import { filter, Observable, of, takeUntil } from 'rxjs';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { tierListColumns } from '../../constants/tier-list-columns.const';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-add-customer-segmentation-tier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    MatTabsModule,
    DemoprojTableComponent,
    MatButtonToggleModule,
  ],
  templateUrl: './add-customer-segmentation-tier-dialog.component.html',
  styleUrl: './add-customer-segmentation-tier-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCustomerSegmentationTierDialogComponent
  extends BaseComponent
  implements OnInit
{
  private router = inject(Router);
  private dialogRef = inject(
    MatDialogRef<AddCustomerSegmentationTierDialogComponent>
  );
  data: {
    tierGroups: TierGroup[];
    segmentGroups: SegmentGroup[];
    data: TierSegmentIncludeExclude[];
  } = inject(MAT_DIALOG_DATA);
  private dialog = inject(MatDialog);

  tabs: WritableSignal<ValueCode[]> = signal(addCustomerSegmentationTierTabs);
  activeTabCode: WritableSignal<string> = signal('segmentation');
  selectedSegmentationItems: WritableSignal<TierSegmentIncludeExclude[]> =
    signal([]);
  selectedTierItems: WritableSignal<TierSegmentIncludeExclude[]> = signal([]);
  isModified: WritableSignal<boolean> = signal(false);

  segmentationTableColumns: WritableSignal<TableColumn[]> = signal(
    segmentationListColumns
  );
  tierTableColumns: WritableSignal<TableColumn[]> = signal(tierListColumns);

  ngOnInit(): void {
    this.data.data.forEach((item) => {
      if (
        this.data.tierGroups.some(
          (tier) => tier.tier_id === item.id && item.type === 'tier'
        )
      ) {
        this.selectedTierItems.update((items) => [
          ...items,
          {
            id: item.id,
            name: item.name,
            isInclude: item.isInclude,
            type: item.type,
          },
        ]);
      } else {
        this.selectedSegmentationItems.update((items) => [
          ...items,
          {
            id: item.id,
            name: item.name,
            isInclude: item.isInclude,
            type: item.type,
          },
        ]);
      }
    });
  }

  onSubmit() {
    this.dialogRef.close([
      ...this.selectedSegmentationItems(),
      ...this.selectedTierItems(),
    ]);
  }

  navigateToCreateForm() {
    if (this.activeTabCode() === 'segmentation') {
      this.router.navigate([
        'user-management',
        'customer-segmentation',
        'form',
        'create',
      ]);
    } else {
      this.router.navigate([
        'user-management',
        'customer-tier',
        'form',
        'create',
      ]);
    }

    this.dialogRef.close();
  }

  changeTab(code: string) {
    this.activeTabCode.set(code);
  }

  onOptionChange(
    rowData: any,
    event: MatButtonToggleChange,
    type: 'tier' | 'segmentation'
  ) {
    this.isModified.set(true);

    if (type === 'tier') {
      this.selectedTierItems.update((items) => {
        const index = items.findIndex((tier) => tier.id === rowData.tier_id);
        if (index > -1) {
          items[index].isInclude = event.value === 'include';
        } else {
          items.push({
            id: rowData.tier_id,
            name: rowData.tier_name_thai,
            isInclude: event.value === 'include',
            type: 'tier',
          });
        }
        return items;
      });
    }

    if (type === 'segmentation') {
      this.selectedSegmentationItems.update((items) => {
        const index = items.findIndex((segment) => segment.id === rowData.id);
        if (index > -1) {
          items[index].isInclude = event.value === 'include';
        } else {
          items.push({
            id: rowData.id,
            name: rowData.segment_name,
            isInclude: event.value === 'include',
            type: 'segmentation',
          });
        }
        return items;
      });
    }
  }

  gettoggleValue(rowData: any, type: 'tier' | 'segmentation') {
    if (type === 'tier') {
      const item = this.selectedTierItems().find(
        (tier) => tier.id === rowData.tier_id
      );
      return item ? (item.isInclude ? 'include' : 'exclude') : null;
    }

    if (type === 'segmentation') {
      const item = this.selectedSegmentationItems().find(
        (segment) => segment.id === rowData.id
      );
      return item ? (item.isInclude ? 'include' : 'exclude') : null;
    }

    return null;
  }

  onCancel() {
    if (!this.isModified()) {
      this.dialogRef.close();
      return;
    }

    this.checkDiscardChanges();
  }

  checkDiscardChanges() {
    const data = {
      title: 'Discard Changes?',
      message: `You have unsaved changes. If you cancel now, your changes will not be saved. Do you want to continue?`,
      btnConfirmText: 'Discard',
      btnCloseText: 'Cancel',
      type: 'warning',
    };

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '25rem',
    });

    ref
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter((isConfirm) => !!isConfirm)
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
