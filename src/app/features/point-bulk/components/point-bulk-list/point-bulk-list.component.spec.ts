import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointBulkListComponent } from './point-bulk-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import * as PointBulkActions from '../../stores/point-bulk-list/point-bulk-list.actions';
import * as CreateEditPointBulkActions from '@app/features/point-bulk/stores/create-edit-point-bulk/create-edit-point-bulk.actions';
import * as pointBulkSelectors from '../../stores/point-bulk-list/point-bulk-list.selectors';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { UploadPointDialogComponent } from '../upload-point-dialog/upload-point-dialog.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

describe('PointBulkListComponent', () => {
  let component: PointBulkListComponent;
  let fixture: ComponentFixture<PointBulkListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;
  let dialog: jest.Mocked<MatDialog>;
  let hasPermissionService: jest.Mocked<HasPermissionService>;
  let actions$: ReplaySubject<any>;

  const mockPointBulks = [
    {
      id: '1',
      name: 'Test Point Bulk 1',
      status: 'active',
      createdAt: '2023-01-01',
    },
    {
      id: '2',
      name: 'Test Point Bulk 2',
      status: 'inactive',
      createdAt: '2023-01-02',
    },
  ];

  const mockPagination = {
    page: 0,
    size: 20,
    totalElements: 2,
    totalPages: 1,
  };

  beforeEach(async () => {
    actions$ = new ReplaySubject(1);

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    dialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      }),
    } as unknown as jest.Mocked<MatDialog>;

    hasPermissionService = {
      hasPermission: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<HasPermissionService>;

    await TestBed.configureTestingModule({
      imports: [PointBulkListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: pointBulkSelectors.selectPointBulks,
              value: mockPointBulks,
            },
            {
              selector: pointBulkSelectors.selectPagination,
              value: mockPagination,
            },
            {
              selector: selectIsLoading('getPointBulks'),
              value: false,
            },
            {
              selector: selectIsLoading('downloadFileTemplate'),
              value: false,
            },
            {
              selector: pointBulkSelectors.selectPointBulkFilters,
              value: { keyword: 'test search' },
            },
          ],
        }),
        provideMockActions(() => actions$),
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialog },
        { provide: HasPermissionService, useValue: hasPermissionService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PointBulkListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    // Set up component properties
    component.hasEditPermission = true;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.featurePermissionCode).toBe(FeaturePermissionCode);
      expect(component.actionPermissionCode).toBe(ActionPermissionCode);
      expect(component.hasEditPermission).toBe(true);
      expect(component.defaultParams()).toEqual({
        page: 0,
        size: 20,
      });
    });

    it('should dispatch setPointBulkFilters action on ngOnInit', () => {
      // ngOnInit is called during fixture.detectChanges() in beforeEach
      expect(store.dispatch).toHaveBeenCalledWith(
        PointBulkActions.setPointBulkFilters({
          filters: { page: 0, size: 20 },
        })
      );
    });
  });

  describe('Observable Properties', () => {
    it('should have correct observable values', (done) => {
      component.pointBulks$.subscribe((pointBulks) => {
        expect(pointBulks).toEqual(mockPointBulks);
        done();
      });
    });

    it('should have correct pagination observable', (done) => {
      component.pagination$.subscribe((pagination) => {
        expect(pagination).toEqual(mockPagination);
        done();
      });
    });

    it('should have correct selectCommonSearch observable', (done) => {
      component.selectCommonSearch$.subscribe((search) => {
        expect(search).toBe('test search');
        done();
      });
    });
  });

  describe('Table Columns', () => {
    it('should initialize with correct table columns', () => {
      const columns = component.tableColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });
  });

  describe('Page Change Handler', () => {
    it('should dispatch setPointBulkFilters action with correct page on page change', () => {
      const newPage = 2;

      component.onPageChange(newPage);

      expect(store.dispatch).toHaveBeenCalledWith(
        PointBulkActions.setPointBulkFilters({
          filters: { page: newPage },
        })
      );
    });
  });

  describe('Page Size Change Handler', () => {
    it('should dispatch setPointBulkFilters action with correct page size and reset page to 0', () => {
      const newPageSize = 50;

      component.onPageSizeChange(newPageSize);

      expect(store.dispatch).toHaveBeenCalledWith(
        PointBulkActions.setPointBulkFilters({
          filters: { size: newPageSize, page: 0 },
        })
      );
    });
  });

  describe('Upload Point Dialog', () => {
    it('should open upload point dialog with correct configuration', () => {
      component.openUploadPointDialog();

      expect(dialog.open).toHaveBeenCalledWith(UploadPointDialogComponent, {
        data: {},
        width: '36rem',
        autoFocus: false,
        disableClose: true,
      });
    });
  });

  describe('Download File Template', () => {
    it('should dispatch downloadFileTemplate action', () => {
      component.downloadFileTemplate();

      expect(store.dispatch).toHaveBeenCalledWith(
        PointBulkActions.downloadFileTemplate()
      );
    });
  });

  describe('Upload Point Success Handler', () => {
    it('should open success dialog and dispatch setPointBulkFilters when upload succeeds', () => {
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(true)),
      };
      dialog.open.mockReturnValue(mockDialogRef as any);

      // Trigger the uploadPointBulkSuccess action
      actions$.next(CreateEditPointBulkActions.uploadPointBulkSuccess());

      expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          message: 'The point was updated',
          btnConfirmText: 'Close',
          hideConfirmIcon: true,
          type: 'success',
        },
        width: '25rem',
      });

      // Simulate dialog close
      mockDialogRef.afterClosed().subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          PointBulkActions.setPointBulkFilters({
            filters: { page: 0, size: 20 },
          })
        );
      });
    });
  });

  describe('Component Destruction', () => {
    it('should dispatch resetAll action on ngOnDestroy', () => {
      component.ngOnDestroy();

      expect(store.dispatch).toHaveBeenCalledWith(PointBulkActions.resetAll());
    });

    it('should call super.ngOnDestroy', () => {
      const superNgOnDestroySpy = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(component)),
        'ngOnDestroy'
      );

      component.ngOnDestroy();

      expect(superNgOnDestroySpy).toHaveBeenCalled();
    });
  });

  describe('Permission Handling', () => {
    it('should check permissions correctly', () => {
      expect(hasPermissionService.hasPermission).toHaveBeenCalledWith([
        {
          feature: FeaturePermissionCode.PointBulkAction,
          action: ActionPermissionCode.CreateEdit,
        },
      ]);
    });

    it('should handle case when user has no edit permission', async () => {
      hasPermissionService.hasPermission.mockReturnValue(false);

      // Recreate component with no permission
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [PointBulkListComponent, NoopAnimationsModule],
        providers: [
          provideMockStore({
            selectors: [
              {
                selector: pointBulkSelectors.selectPointBulks,
                value: mockPointBulks,
              },
              {
                selector: pointBulkSelectors.selectPagination,
                value: mockPagination,
              },
              {
                selector: selectIsLoading('getPointBulks'),
                value: false,
              },
              {
                selector: selectIsLoading('downloadFileTemplate'),
                value: false,
              },
              {
                selector: pointBulkSelectors.selectPointBulkFilters,
                value: { keyword: 'test search' },
              },
            ],
          }),
          provideMockActions(() => actions$),
          { provide: Router, useValue: router },
          { provide: MatDialog, useValue: dialog },
          { provide: HasPermissionService, useValue: hasPermissionService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      const newFixture = TestBed.createComponent(PointBulkListComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.hasEditPermission).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should render table with correct data', () => {
      const tableElement =
        fixture.debugElement.nativeElement.querySelector('app-demoproj-table');
      expect(tableElement).toBeTruthy();
    });

    it('should render upload button when user has permission', () => {
      component.hasEditPermission = true;
      fixture.detectChanges();

      const uploadButton =
        fixture.debugElement.nativeElement.querySelector('button[mat-button]');
      expect(uploadButton).toBeTruthy();
    });

    it('should render download template button', () => {
      const downloadButtons =
        fixture.debugElement.nativeElement.querySelectorAll(
          'button[mat-button]'
        );
      expect(downloadButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Loading States', () => {
    it('should handle loading state for point bulks', async () => {
      store.overrideSelector(selectIsLoading('getPointBulks'), true);
      store.refreshState();

      component.loading$.subscribe((loading) => {
        expect(loading).toBe(true);
      });
    });

    it('should handle loading state for file download', async () => {
      store.overrideSelector(selectIsLoading('downloadFileTemplate'), true);
      store.refreshState();

      component.downloadLoading$.subscribe((downloadLoading) => {
        expect(downloadLoading).toBe(true);
      });
    });
  });

  describe('Search Functionality', () => {
    it('should handle empty search keyword', async () => {
      store.overrideSelector(pointBulkSelectors.selectPointBulkFilters, {
        keyword: '',
      });
      store.refreshState();

      component.selectCommonSearch$.subscribe((search) => {
        expect(search).toBe('');
      });
    });

    it('should handle undefined keyword in filters', async () => {
      store.overrideSelector(pointBulkSelectors.selectPointBulkFilters, {});
      store.refreshState();

      component.selectCommonSearch$.subscribe((search) => {
        expect(search).toBe('');
      });
    });
  });

  describe('Signal Updates', () => {
    it('should update defaultParams signal', () => {
      const newParams = { page: 1, size: 50 };
      component.defaultParams.set(newParams);

      expect(component.defaultParams()).toEqual(newParams);
    });

    it('should update tableColumns signal', () => {
      const newColumns = [{ key: 'test', label: 'Test Column' }] as any;
      component.tableColumns.set(newColumns);

      expect(component.tableColumns()).toEqual(newColumns);
    });
  });

  describe('Error Handling', () => {
    it('should handle dialog close without action', () => {
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(null)),
      };
      dialog.open.mockReturnValue(mockDialogRef as any);

      actions$.next(CreateEditPointBulkActions.uploadPointBulkSuccess());

      expect(dialog.open).toHaveBeenCalled();
    });
  });
});
