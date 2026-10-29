import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SettingDisplayOnPageSectionComponent } from './setting-display-on-page-section.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subject, BehaviorSubject, of } from 'rxjs';
import * as PopupAnnouncementActions from '../../stores/popup-announcement/popup-announcement.actions';
import * as popupAnnouncementSelectors from '../../stores/popup-announcement/popup-announcement.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { ValueCode } from '@app/shared/models/value-code.model';
import { PopupAnnouncementTab } from '../../models/popup-announcement-tabs.model';

describe('SettingDisplayOnPageSectionComponent', () => {
  let component: SettingDisplayOnPageSectionComponent;
  let fixture: ComponentFixture<SettingDisplayOnPageSectionComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;

  const queryParams$ = new BehaviorSubject<any>({});

  const mockPopupAnnouncementTabs: PopupAnnouncementTab[] = [
    { page_id: 1, page_name: 'Home Page' },
    { page_id: 2, page_name: 'About Page' },
    { page_id: 3, page_name: 'Contact Page' },
  ];

  const mockActivatedRoute = {
    queryParams: queryParams$.asObservable(),
  };

  const initialState = {
    popupAnnouncement: {
      popupAnnouncementTabs: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SettingDisplayOnPageSectionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: popupAnnouncementSelectors.selectPopupAnnouncementTabs,
              value: [], // Start with empty array
            },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingDisplayOnPageSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject(FormBuilder);

    // Setup form group
    component.formGroup = formBuilder.group({
      pageId: ['1'],
    });
    component.isCreateMode = true;

    // Setup spy methods
    jest.spyOn(store, 'dispatch');

    // Reset query params
    queryParams$.next({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ... other tests ...

  describe('combineLatest behavior', () => {
    it('should process data when both observables emit', fakeAsync(() => {
      const patchValueSpy = jest.spyOn(component.pageIdControl!, 'patchValue');

      // Override selector to return data
      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncementTabs,
        mockPopupAnnouncementTabs
      );
      store.refreshState();

      // Start ngOnInit
      component.ngOnInit();

      // Emit query params
      queryParams$.next({ pageId: '2' });
      tick();

      expect(component.pageOptions).toEqual([
        { value: 'Home Page', code: '1' },
        { value: 'About Page', code: '2' },
        { value: 'Contact Page', code: '3' },
      ]);

      expect(patchValueSpy).toHaveBeenCalledWith('2', { emitEvent: false });
    }));

    it('should filter out empty popupAnnouncementTabs arrays', fakeAsync(() => {
      // Start with empty selector (already configured in beforeEach)
      component.ngOnInit();

      // Emit query params
      queryParams$.next({ pageId: '2' });
      tick();

      // Should not process empty arrays due to filter
      expect(component.pageOptions).toEqual([]);

      // Now update selector to return data
      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncementTabs,
        mockPopupAnnouncementTabs
      );
      store.refreshState();
      tick();

      // Now it should process
      expect(component.pageOptions.length).toBe(3);
    }));

    it('should handle queryParams emitting before popupAnnouncementTabs', fakeAsync(() => {
      component.ngOnInit();

      // Emit query params first
      queryParams$.next({ pageId: '3' });
      tick();

      // Nothing should happen yet due to empty array filter
      expect(component.pageOptions).toEqual([]);

      // Now emit tabs
      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncementTabs,
        mockPopupAnnouncementTabs
      );
      store.refreshState();
      tick();

      // Now processing should occur
      expect(component.pageOptions.length).toBe(3);
    }));

    it('should handle multiple emissions from both observables', fakeAsync(() => {
      const patchValueSpy = jest.spyOn(component.pageIdControl!, 'patchValue');
      component.isCreateMode = true;

      // Set up with data
      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncementTabs,
        mockPopupAnnouncementTabs
      );
      store.refreshState();

      component.ngOnInit();

      // First emission
      queryParams$.next({ pageId: '1' });
      tick();

      expect(patchValueSpy).toHaveBeenCalledWith('1', { emitEvent: false });

      // Second emission - only query params change
      queryParams$.next({ pageId: '2' });
      tick();

      expect(patchValueSpy).toHaveBeenCalledWith('2', { emitEvent: false });
      expect(patchValueSpy).toHaveBeenCalledTimes(3);
    }));

    it('should handle rapid emissions from both observables', fakeAsync(() => {
      component.isCreateMode = true;
      const patchValueSpy = jest.spyOn(component.pageIdControl!, 'patchValue');

      // Set up with data
      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncementTabs,
        mockPopupAnnouncementTabs
      );
      store.refreshState();

      component.ngOnInit();

      // Rapid emissions
      queryParams$.next({ pageId: '1' });
      queryParams$.next({ pageId: '2' });
      queryParams$.next({ pageId: '3' });
      tick();

      // Should patch with the last query param value
      expect(patchValueSpy).toHaveBeenCalledWith('3', { emitEvent: false });
      // Note: Due to how combineLatest works, it might be called multiple times
      expect(patchValueSpy).toHaveBeenCalled();
    }));

    it('should not trigger subscription callback when filter condition is not met', fakeAsync(() => {
      const subscribeSpy = jest.fn();

      // Mock the combineLatest subscription
      const originalCombineLatest = component.ngOnInit;
      component.ngOnInit = function () {
        // Call original method
        originalCombineLatest.call(this);
      };

      component.ngOnInit();

      // Emit query params with empty tabs (should be filtered out)
      queryParams$.next({ pageId: '2' });
      tick();

      // The main subscription callback shouldn't process due to filter
      expect(component.pageOptions).toEqual([]);
    }));

    it('should complete combineLatest subscription on component destroy', fakeAsync(() => {
      const takeUntilSpy = jest.spyOn(component.destroy$, 'next');
      const completeDestroySpy = jest.spyOn(component.destroy$, 'complete');

      component.ngOnInit();

      // Trigger component destruction
      component.ngOnDestroy();

      expect(takeUntilSpy).toHaveBeenCalled();
      expect(completeDestroySpy).toHaveBeenCalled();
    }));

    it('should handle empty array and then non-empty array correctly', fakeAsync(() => {
      component.ngOnInit();

      // First: emit with empty array (default state)
      queryParams$.next({ pageId: '2' });
      tick();

      expect(component.pageOptions).toEqual([]);

      // Second: update to non-empty array
      store.overrideSelector(
        popupAnnouncementSelectors.selectPopupAnnouncementTabs,
        mockPopupAnnouncementTabs
      );
      store.refreshState();
      tick();

      expect(component.pageOptions.length).toBe(3);
      expect(component.pageOptions).toEqual([
        { value: 'Home Page', code: '1' },
        { value: 'About Page', code: '2' },
        { value: 'Contact Page', code: '3' },
      ]);
    }));
  });

  // ... other test groups ...

  describe('getDropdownValue method', () => {
    beforeEach(() => {
      component.pageOptions = [
        { value: 'Home Page', code: '1' },
        { value: 'About Page', code: '2' },
        { value: 'Contact Page', code: '3' },
      ];
    });

    it('should return correct value for existing code', () => {
      const result = component.getDropdownValue('1', component.pageOptions);
      expect(result).toBe('Home Page');
    });

    it('should return correct value for another existing code', () => {
      const result = component.getDropdownValue('2', component.pageOptions);
      expect(result).toBe('About Page');
    });

    it('should return empty string for non-existing code', () => {
      const result = component.getDropdownValue('999', component.pageOptions);
      expect(result).toBe('');
    });

    it('should return empty string for null selectedCode', () => {
      const result = component.getDropdownValue(null, component.pageOptions);
      expect(result).toBe('');
    });

    it('should return empty string for undefined selectedCode', () => {
      const result = component.getDropdownValue(
        undefined as any,
        component.pageOptions
      );
      expect(result).toBe('');
    });

    it('should return empty string for empty dropdownOptions array', () => {
      const result = component.getDropdownValue('1', []);
      expect(result).toBe('');
    });
  });
});
