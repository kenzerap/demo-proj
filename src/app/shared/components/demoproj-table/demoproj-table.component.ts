import { CommonModule, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ContentChild,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DemoprojPaginatorComponent } from '../demoproj-paginator/demoproj-paginator.component';
import { ColumnType, TableColumn } from './models/table-column.model';
import {
  MatSortHeader,
  MatSortModule,
  Sort,
  SortDirection,
} from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { Pagination } from '../../models/paged-data.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HighlightTextDirective } from '../../directives/highlight-text.directive';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { SecurityNoFormatPipe } from '../../pipes/security-no-format.pipe';
import { PrefixNumberPipe } from '../../pipes/prefix-number.pipe';
import { SelectionModel } from '@angular/cdk/collections';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DragDropChange } from './models/drag-drop-change.model';

@Component({
  selector: 'app-demoproj-table',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    DemoprojPaginatorComponent,
    MatSortModule,
    MatIconModule,
    MatSortHeader,
    MatProgressSpinnerModule,
    HighlightTextDirective,
    PhoneFormatPipe,
    SecurityNoFormatPipe,
    PrefixNumberPipe,
    CdkDropList,
    CdkDrag,
  ],
  providers: [DecimalPipe],
  templateUrl: './demoproj-table.component.html',
  styleUrl: './demoproj-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoprojTableComponent<T> {
  private changeDetectorRef = inject(ChangeDetectorRef);

  @Input() data: T[] = [];
  @Input() tableColumns: TableColumn[] = [];
  @Input() isPaginatorEnabled = true;
  @Input() pagination: Pagination | null = null;
  @Input() sortField = '';
  @Input() sortDirection: SortDirection = 'asc';
  @Input() loading = false;
  @Input() noDataMessage = 'No records found.';
  @Input() searchHighlightText = '';
  @Input() tableSectionStyle = {};
  @Input() tableStyle = {};
  @Input() pageSizeOptions: number[] = [10, 20, 50];
  @Input() isMultipleSelect = false;
  @Input() isSingleSelect = false;
  @Input() selectedItems: T[] = [];
  @Input() disableDragDrop = true;

  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() selectedItemsChange = new EventEmitter<{
    items: T[];
    toggleItem: T;
  }>();
  @Output() dragDropChange = new EventEmitter<DragDropChange<T>>();

  @ContentChild('customColumn') customColumnTemplate!: TemplateRef<any>;

  columnType: WritableSignal<typeof ColumnType> = signal(ColumnType);

  displayedColumns: Signal<string[]> = computed(() =>
    this.tableColumns.map((column) => column.code)
  );

  selection: Signal<SelectionModel<T>> = computed(() => {
    return new SelectionModel<T>(true, this.selectedItems);
  });
  dragDropDisabled: WritableSignal<boolean> = signal(true);

  onSortChange(sortState: Sort) {
    this.sortChange.emit(sortState);
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onPageSizeChange(pageSize: number) {
    this.pageSizeChange.emit(pageSize);
  }

  checkSelected(row: T) {
    const isSelectedInit = this.selectedItems.some(
      (item) => JSON.stringify(item) === JSON.stringify(row)
    );

    return this.selection().isSelected(row) || isSelectedInit;
  }

  onRowClick(rowData: T) {
    this.rowClick.emit(rowData);

    if (this.isMultipleSelect) {
      this.selection().toggle(rowData);
      this.selectedItemsChange.emit({
        items: this.selection().selected,
        toggleItem: rowData,
      });
    }

    if (this.isSingleSelect) {
      const hasValue = this.selection().hasValue();
      const isSelected = this.selection().isSelected(rowData);

      if (hasValue && !isSelected) {
        this.selection().clear();
      }

      if (hasValue && isSelected) {
        return;
      }

      this.selection().toggle(rowData);
      this.selectedItemsChange.emit({
        items: this.selection().selected,
        toggleItem: rowData,
      });
    }
  }

  drop(event: CdkDragDrop<T[]>) {
    this.dragDropDisabled.set(true);
    const newData: any[] = [...this.data];

    const dragDisabled = newData[event.currentIndex].dragDisabled;

    if (dragDisabled) {
      return;
    }

    const previousIndex = this.data.findIndex((d) => d === event.item.data);

    moveItemInArray(newData, previousIndex, event.currentIndex);
    this.dragDropChange.emit({
      data: newData,
      previousIndex,
      currentIndex: event.currentIndex,
    });
  }

  onMouseDown() {
    this.dragDropDisabled.set(false);
    this.changeDetectorRef.detectChanges();
  }
}
