import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TargetGroupSectionComponent } from './target-group-section.component';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TargetGroupSectionComponent', () => {
  let component: TargetGroupSectionComponent;
  let fixture: ComponentFixture<TargetGroupSectionComponent>;
  let mockDialog: any;

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of([{ id: 1, isInclude: true }])),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TargetGroupSectionComponent],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetGroupSectionComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      target_group_type: new FormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog and handle the result', () => {
    const mockResult: TierSegmentIncludeExclude[] = [
      { id: 1, isInclude: true, name: 'Group 1', type: 'tier' },
      { id: 2, isInclude: false, name: 'Group 2', type: 'tier' },
    ];
    mockDialog.open.mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(mockResult)),
    });

    component.openAddTargetGroupDialog();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.includeGroups()).toEqual([
      { id: 1, isInclude: true, name: 'Group 1', type: 'tier' },
    ]);
    expect(component.excludeGroups()).toEqual([
      { id: 2, isInclude: false, name: 'Group 2', type: 'tier' },
    ]);
  });

  it('should remove an item from includeGroups', () => {
    component.includeGroups.set([
      { id: 1, isInclude: true, name: 'Group 1', type: 'tier' },
    ]);
    component.removeItem(
      { id: 1, isInclude: true, name: 'Group 1', type: 'tier' },
      'includeGroups'
    );
    expect(component.includeGroups()).toEqual([]);
  });

  it('should remove an item from excludeGroups', () => {
    component.excludeGroups.set([
      { id: 2, isInclude: false, name: 'Group 2', type: 'tier' },
    ]);
    component.removeItem(
      { id: 2, isInclude: false, name: 'Group 2', type: 'tier' },
      'excludeGroups'
    );
    expect(component.excludeGroups()).toEqual([]);
  });

  it('should set tierSegmentIncludeExclude and update groups', () => {
    const mockValue: TierSegmentIncludeExclude[] = [
      { id: 1, isInclude: true, name: 'Group 1', type: 'tier' },
      { id: 2, isInclude: false, name: 'Group 2', type: 'tier' },
    ];
    component.tierSegmentIncludeExclude = mockValue;
    expect(component.includeGroups()).toEqual([
      { id: 1, isInclude: true, name: 'Group 1', type: 'tier' },
    ]);
    expect(component.excludeGroups()).toEqual([
      { id: 2, isInclude: false, name: 'Group 2', type: 'tier' },
    ]);
  });
});
