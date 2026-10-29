import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-demoproj-paginator',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './demoproj-paginator.component.html',
  styleUrl: './demoproj-paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoprojPaginatorComponent {
  @Input() totalRecords = 0;
  @Input() pageSize = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50];
  @Input() totalPages = 0;
  @Input() currentPage = 0; // start page = 0
  @Input() maxVisible = 6;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get displayedCurrentPage(): number {
    return this.currentPage + 1;
  }

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const displayedCurrentPage = this.currentPage + 1;

    if (this.totalPages <= this.maxVisible) {
      // Show all pages if total pages are less than or equal to max visible
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (displayedCurrentPage <= 3) {
        // Show first 5 pages if current page is less than or equal to 3
        for (let i = 1; i <= this.maxVisible - 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (displayedCurrentPage >= this.totalPages - 2) {
        // Show last 5 pages if current page is one of the last 3 pages
        pages.push(1);
        pages.push('...');
        for (
          let i = this.totalPages - (this.maxVisible - 2);
          i <= this.totalPages;
          i++
        ) {
          pages.push(i);
        }
      } else {
        // Show 3 pages before and after the current page
        pages.push(1);
        pages.push('...');
        for (
          let i = displayedCurrentPage - 1;
          i <= displayedCurrentPage + 1;
          i++
        ) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  changePage(uiPage: number | string) {
    if (typeof uiPage === 'number') {
      this.currentPage = uiPage - 1;
      this.pageChange.emit(this.currentPage);
    }
  }

  onPageSizeChange(): void {
    this.pageSizeChange.emit(Number(this.pageSize));
  }
}
