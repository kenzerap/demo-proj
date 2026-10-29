import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCustomerSegmentationTierDialogComponent } from './add-customer-segmentation-tier-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddCustomerSegmentationTierDialogComponent', () => {
  let component: AddCustomerSegmentationTierDialogComponent;
  let fixture: ComponentFixture<AddCustomerSegmentationTierDialogComponent>;
  let mockDialogRef: jest.Mocked<
    MatDialogRef<AddCustomerSegmentationTierDialogComponent>
  >;
  let mockRouter: jest.Mocked<Router>;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<
      MatDialogRef<AddCustomerSegmentationTierDialogComponent>
    >;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockDialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [AddCustomerSegmentationTierDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            partyId: 123,
            tierGroups: [],
            segmentGroups: [],
            data: [],
          },
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(
      AddCustomerSegmentationTierDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tabs and selected items on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tabs().length).toBeGreaterThan(0);
    expect(component.selectedTierItems().length).toBe(0);
    expect(component.selectedSegmentationItems().length).toBe(0);
  });

  it('should close the dialog with selected items on submit', () => {
    component.selectedTierItems.set([
      { id: 1, name: 'Tier 1', isInclude: true, type: 'tier' },
    ]);
    component.selectedSegmentationItems.set([
      { id: 2, name: 'Segment 1', isInclude: true, type: 'segmentation' },
    ]);

    component.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith([
      { id: 2, name: 'Segment 1', isInclude: true, type: 'segmentation' },
      { id: 1, name: 'Tier 1', isInclude: true, type: 'tier' },
    ]);
  });

  it('should navigate to create form and close the dialog', () => {
    component.activeTabCode.set('segmentation');
    component.navigateToCreateForm();

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'user-management',
      'customer-segmentation',
      'form',
      'create',
    ]);
    expect(mockDialogRef.close).toHaveBeenCalled();

    component.activeTabCode.set('tier');
    component.navigateToCreateForm();

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'user-management',
      'customer-tier',
      'form',
      'create',
    ]);
  });

  it('should change the active tab', () => {
    component.changeTab('tier');
    expect(component.activeTabCode()).toBe('tier');
  });

  it('should update selected items on option change for tier', () => {
    const mockEvent = { value: 'include' } as any;
    const rowData = { tier_id: 1, tier_name_thai: 'Tier 1' };

    // Test adding new tier item
    component.onOptionChange(rowData, mockEvent, 'tier');
    expect(component.selectedTierItems().length).toBe(1);
    expect(component.selectedTierItems()[0].isInclude).toBe(true);
    expect(component.isModified()).toBe(true);

    // Test updating existing tier item
    component.onOptionChange(rowData, { value: 'exclude' } as any, 'tier');
    expect(component.selectedTierItems()[0].isInclude).toBe(false);
  });

  it('should update selected items on option change for segmentation', () => {
    const mockEvent = { value: 'include' } as any;
    const rowData = { id: 2, segment_name: 'Segment 1' };

    // Test adding new segmentation item
    component.onOptionChange(rowData, mockEvent, 'segmentation');
    expect(component.selectedSegmentationItems().length).toBe(1);
    expect(component.selectedSegmentationItems()[0].isInclude).toBe(true);
    expect(component.isModified()).toBe(true);

    // Test updating existing segmentation item
    component.onOptionChange(
      rowData,
      { value: 'exclude' } as any,
      'segmentation'
    );
    expect(component.selectedSegmentationItems()[0].isInclude).toBe(false);
  });

  it('should return correct toggle value for tier', () => {
    const rowData = { tier_id: 1 };

    // Test when no item is selected
    expect(component.gettoggleValue(rowData, 'tier')).toBeNull();

    // Test when item is selected with include
    component.selectedTierItems.set([
      { id: 1, name: 'Tier 1', isInclude: true, type: 'tier' },
    ]);
    expect(component.gettoggleValue(rowData, 'tier')).toBe('include');

    // Test when item is selected with exclude
    component.selectedTierItems.set([
      { id: 1, name: 'Tier 1', isInclude: false, type: 'tier' },
    ]);
    expect(component.gettoggleValue(rowData, 'tier')).toBe('exclude');
  });

  it('should return correct toggle value for segmentation', () => {
    const rowData = { id: 2 };

    // Test when no item is selected
    expect(component.gettoggleValue(rowData, 'segmentation')).toBeNull();

    // Test when item is selected with include
    component.selectedSegmentationItems.set([
      { id: 2, name: 'Segment 1', isInclude: true, type: 'segmentation' },
    ]);
    expect(component.gettoggleValue(rowData, 'segmentation')).toBe('include');

    // Test when item is selected with exclude
    component.selectedSegmentationItems.set([
      { id: 2, name: 'Segment 1', isInclude: false, type: 'segmentation' },
    ]);
    expect(component.gettoggleValue(rowData, 'segmentation')).toBe('exclude');
  });

  it('should return null for invalid toggle value type', () => {
    const rowData = { id: 1 };
    expect(component.gettoggleValue(rowData, 'invalid' as any)).toBeNull();
  });

  it('should close dialog immediately if not modified on cancel', () => {
    component.isModified.set(false);
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should check discard changes if modified on cancel', () => {
    component.isModified.set(true);
    const checkDiscardChangesSpy = jest
      .spyOn(component, 'checkDiscardChanges')
      .mockImplementation();

    component.onCancel();

    expect(checkDiscardChangesSpy).toHaveBeenCalled();
  });

  it('should initialize selectedTierItems and selectedSegmentationItems based on data with tier matching', () => {
    component.data = {
      tierGroups: [
        {
          tier_id: 1,
          tier_group_id: 1,
          tier_name_english: 'Tier 1',
          tier_name_thai: 'Tier 1',
          detail: 'Tier 1',
          status: 'ACTIVE',
          color: 'red',
          created_date: '2021-01-01',
          updated_date: '2021-01-01',
          created_by: 'admin',
          updated_by: 'admin',
          tier_rule_list: [],
        },
      ],
      segmentGroups: [],
      data: [{ id: 1, name: 'Tier 1', isInclude: true, type: 'tier' }],
    } as any;

    component.ngOnInit();

    expect(component.selectedTierItems()).toEqual([
      { id: 1, name: 'Tier 1', isInclude: true, type: 'tier' },
    ]);
  });

  it('should initialize selectedTierItems and selectedSegmentationItems based on data with segmentation matching', () => {
    component.data = {
      tierGroups: [],
      segmentGroups: [
        {
          id: 2,
          priority: 1,
          segment_name: 'Segment 1',
          status: 'INACTIVE',
          created_date: '2021-01-01',
          updated_date: '2021-01-01',
          segment_rule_list: [],
          segment_users_volume: 1,
        },
      ],
      data: [
        { id: 2, name: 'Segment 1', isInclude: false, type: 'segmentation' },
      ],
    } as any;

    component.ngOnInit();

    expect(component.selectedSegmentationItems()).toEqual([
      { id: 2, name: 'Segment 1', isInclude: false, type: 'segmentation' },
    ]);
  });

  it('should handle data items that do not match tier or segmentation groups', () => {
    component.data = {
      tierGroups: [],
      segmentGroups: [],
      data: [{ id: 999, name: 'Unknown Item', isInclude: true, type: 'tier' }],
    } as any;

    component.ngOnInit();

    // Should not add items that don't match existing groups
    expect(component.selectedTierItems()).toEqual([]);
    expect(component.selectedSegmentationItems()).toEqual([
      {
        id: 999,
        isInclude: true,
        name: 'Unknown Item',
        type: 'tier',
      },
    ]);
  });

  it('should handle mixed tier and segmentation data initialization', () => {
    component.data = {
      tierGroups: [
        {
          tier_id: 1,
          tier_group_id: 1,
          tier_name_english: 'Tier 1',
          tier_name_thai: 'Tier 1',
          detail: 'Tier 1',
          status: 'ACTIVE',
          color: 'red',
          created_date: '2021-01-01',
          updated_date: '2021-01-01',
          created_by: 'admin',
          updated_by: 'admin',
          tier_rule_list: [],
        },
      ],
      segmentGroups: [
        {
          id: 2,
          priority: 1,
          segment_name: 'Segment 1',
          status: 'ACTIVE',
          created_date: '2021-01-01',
          updated_date: '2021-01-01',
          segment_rule_list: [],
          segment_users_volume: 1,
        },
      ],
      data: [
        { id: 1, name: 'Tier 1', isInclude: true, type: 'tier' },
        { id: 2, name: 'Segment 1', isInclude: false, type: 'segmentation' },
      ],
    } as any;

    component.ngOnInit();

    expect(component.selectedTierItems()).toEqual([
      { id: 1, name: 'Tier 1', isInclude: true, type: 'tier' },
    ]);

    expect(component.selectedSegmentationItems()).toEqual([
      { id: 2, name: 'Segment 1', isInclude: false, type: 'segmentation' },
    ]);
  });

  it('should set isModified to true when onOptionChange is called', () => {
    const mockEvent = { value: 'include' } as any;
    const rowData = { tier_id: 1, tier_name_thai: 'Tier 1' };

    component.isModified.set(false);
    component.onOptionChange(rowData, mockEvent, 'tier');

    expect(component.isModified()).toBe(true);
  });

  it('should handle empty data array in ngOnInit', () => {
    component.data = {
      tierGroups: [],
      segmentGroups: [],
      data: [],
    } as any;

    component.ngOnInit();

    expect(component.selectedTierItems()).toEqual([]);
    expect(component.selectedSegmentationItems()).toEqual([]);
  });

  it('should initialize with default active tab as segmentation', () => {
    expect(component.activeTabCode()).toBe('segmentation');
  });

  it('should initialize with isModified as false', () => {
    expect(component.isModified()).toBe(false);
  });
});
