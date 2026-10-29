import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoprojPaginatorComponent } from './demoproj-paginator.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DemoprojPaginatorComponent', () => {
  let component: DemoprojPaginatorComponent;
  let fixture: ComponentFixture<DemoprojPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        DemoprojPaginatorComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoprojPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return displayedCurrentPage correctly', () => {
    component.currentPage = 4;
    expect(component.displayedCurrentPage).toBe(5);
  });

  it('should calculate visiblePages correctly', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    expect(component.visiblePages).toEqual([1, '...', 5, 6, 7, '...', 10]);
  });

  it('should emit pageChange when previousPage is called and currentPage > 0', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.previousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should not emit pageChange when previousPage is called and currentPage is 0', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.currentPage = 0;
    component.previousPage();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit pageChange when nextPage is called and currentPage < totalPages - 1', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalPages = 3;
    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange when nextPage is called and currentPage is the last page', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.totalPages = 3;
    component.nextPage();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit pageChange with the correct page when changePage is called with a number', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.changePage(3);
    expect(component.currentPage).toBe(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange when changePage is called with a string', () => {
    jest.spyOn(component.pageChange, 'emit');
    component.changePage('...');
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit pageSizeChange when onPageSizeChange is called', () => {
    jest.spyOn(component.pageSizeChange, 'emit');
    component.pageSize = 20;
    component.onPageSizeChange();
    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(20);
  });

  it('should handle edge cases for visiblePages', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    expect(component.visiblePages).toEqual([1, 2, 3]);
  });

  it('should handle visiblePages when totalPages is less than or equal to maxVisible', () => {
    component.totalPages = 5;
    component.maxVisible = 6;
    expect(component.visiblePages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle visiblePages when currentPage is one of the last 3 pages', () => {
    component.totalPages = 10;
    component.currentPage = 8;
    expect(component.visiblePages).toEqual([1, '...', 6, 7, 8, 9, 10]);
  });

  it('should handle visiblePages when currentPage is one of the first 3 pages', () => {
    component.totalPages = 10;
    component.currentPage = 1;
    expect(component.visiblePages).toEqual([1, 2, 3, 4, 5, '...', 10]);
  });
});
