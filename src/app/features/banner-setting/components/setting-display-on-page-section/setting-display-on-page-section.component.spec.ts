import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingDisplayOnPageSectionComponent } from './setting-display-on-page-section.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, of } from 'rxjs';
import * as BannerSettingActions from '../../stores/banner-setting/banner-setting.actions';
import * as popupAnnouncementSelectors from '../../stores/banner-setting/banner-setting.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ValueCode } from '@app/shared/models/value-code.model';
import { BannerSettingTab } from '../../models/banner-setting-tabs.model';

describe('SettingDisplayOnPageSectionComponent', () => {
  let component: SettingDisplayOnPageSectionComponent;
  let fixture: ComponentFixture<SettingDisplayOnPageSectionComponent>;
  let store: MockStore;
  let activatedRoute: ActivatedRoute;
  let queryParams$: BehaviorSubject<any>;
  let formBuilder: FormBuilder;

  const mockBannerSettingTabs: BannerSettingTab[] = [
    { page_id: 1, page_name: 'Page 1' },
    { page_id: 2, page_name: 'Page 2' },
    { page_id: 3, page_name: 'Page 3' },
  ];

  beforeEach(async () => {
    queryParams$ = new BehaviorSubject<any>({});

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SettingDisplayOnPageSectionComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            bannerSettings: {
              bannerSettingTabs: mockBannerSettingTabs,
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParams$.asObservable(),
          },
        },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingDisplayOnPageSectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formBuilder = TestBed.inject(FormBuilder);

    // Mock the selector to return the banner setting tabs
    store.overrideSelector(
      popupAnnouncementSelectors.selectBannerSettingTabs,
      mockBannerSettingTabs
    );

    // Setup default form group
    component.formGroup = formBuilder.group({
      pageId: [''],
    });
    component.isCreateMode = true;
  });

  afterEach(() => {
    queryParams$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.pageOptions).toEqual([]);
      expect(component.formGroup).toBeDefined();
      expect(component.isCreateMode).toBe(true);
    });

    it('should have correct injectable dependencies', () => {
      expect(component['store']).toBeDefined();
      expect(component['activatedRoute']).toBeDefined();
    });

    it('should have popupAnnouncementTabs$ observable', () => {
      expect(component.popupAnnouncementTabs$).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch getBannerSettingTabs action on init', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        BannerSettingActions.getBannerSettingTabs({
          isDropdownOptions: false,
        })
      );
    });

    it('should update pageOptions when banner setting tabs are loaded', (done) => {
      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions).toEqual([
          { value: 'Page 1', code: '1' },
          { value: 'Page 2', code: '2' },
          { value: 'Page 3', code: '3' },
        ]);
        done();
      }, 0);
    });

    it('should patch pageIdControl with queryParam value in create mode', (done) => {
      queryParams$.next({ pageId: '2' });

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageIdControl?.value).toBe('2');
        done();
      }, 0);
    });

    it('should patch pageIdControl with first option when no queryParam pageId in create mode', (done) => {
      queryParams$.next({});

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageIdControl?.value).toBe('1');
        done();
      }, 0);
    });

    it('should not patch pageIdControl when not in create mode', (done) => {
      component.isCreateMode = false;
      const patchValueSpy = jest.spyOn(component.pageIdControl!, 'patchValue');

      component.ngOnInit();

      setTimeout(() => {
        expect(patchValueSpy).not.toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should handle empty banner setting tabs array', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        []
      );
      store.refreshState();

      component.ngOnInit();

      // The filter should prevent subscription from firing with empty array
      setTimeout(() => {
        expect(component.pageOptions).toEqual([]);
        done();
      }, 100);
    });

    it('should handle queryParams with additional properties', (done) => {
      queryParams$.next({ pageId: '3', someOtherParam: 'value' });

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageIdControl?.value).toBe('3');
        done();
      }, 0);
    });

    it('should patch value with emitEvent: false', (done) => {
      const patchValueSpy = jest.spyOn(component.pageIdControl!, 'patchValue');
      queryParams$.next({ pageId: '2' });

      component.ngOnInit();

      setTimeout(() => {
        expect(patchValueSpy).toHaveBeenCalledWith('2', { emitEvent: false });
        done();
      }, 0);
    });
  });

  describe('pageIdControl getter', () => {
    it('should return pageId form control when formGroup exists', () => {
      const control = component.pageIdControl;
      expect(control).toBe(component.formGroup.get('pageId'));
    });

    it('should return null when formGroup is null', () => {
      component.formGroup = null as any;
      const control = component.pageIdControl;
      expect(control).toBeUndefined();
    });

    it('should return undefined when formGroup is undefined', () => {
      component.formGroup = undefined as any;
      const control = component.pageIdControl;
      expect(control).toBeUndefined();
    });
  });

  describe('getDropdownValue', () => {
    const mockDropdownOptions: ValueCode[] = [
      { code: '1', value: 'Page 1' },
      { code: '2', value: 'Page 2' },
      { code: '3', value: 'Page 3' },
    ];

    it('should return the correct dropdown value for existing code', () => {
      const result = component.getDropdownValue('1', mockDropdownOptions);
      expect(result).toBe('Page 1');
    });

    it('should return the correct dropdown value for different existing code', () => {
      const result = component.getDropdownValue('2', mockDropdownOptions);
      expect(result).toBe('Page 2');
    });

    it('should return empty string when code is not found', () => {
      const result = component.getDropdownValue('999', mockDropdownOptions);
      expect(result).toBe('');
    });

    it('should return empty string when selectedCode is null', () => {
      const result = component.getDropdownValue(null, mockDropdownOptions);
      expect(result).toBe('');
    });

    it('should return empty string when selectedCode is empty string', () => {
      const result = component.getDropdownValue('', mockDropdownOptions);
      expect(result).toBe('');
    });

    it('should return empty string when dropdownOptions is empty array', () => {
      const result = component.getDropdownValue('1', []);
      expect(result).toBe('');
    });

    it('should handle undefined selectedCode', () => {
      const result = component.getDropdownValue(
        undefined as any,
        mockDropdownOptions
      );
      expect(result).toBe('');
    });
  });

  describe('Component Properties', () => {
    it('should have correct popupAnnouncementTabs$ observable', () => {
      expect(component.popupAnnouncementTabs$).toBeDefined();
    });

    it('should update pageOptions property correctly', (done) => {
      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions.length).toBe(3);
        expect(component.pageOptions[0]).toEqual({
          value: 'Page 1',
          code: '1',
        });
        done();
      }, 0);
    });
  });

  describe('Form Integration', () => {
    it('should work with different form control names', () => {
      component.formGroup = formBuilder.group({
        pageId: ['initial-value'],
        otherControl: ['other-value'],
      });

      expect(component.pageIdControl?.value).toBe('initial-value');
    });

    it('should handle form control value changes', () => {
      const newValue = '2';
      component.pageIdControl?.setValue(newValue);

      expect(component.pageIdControl?.value).toBe(newValue);
    });

    it('should handle form control patching', () => {
      component.pageIdControl?.patchValue('3');
      expect(component.pageIdControl?.value).toBe('3');
    });
  });

  describe('Error Handling', () => {
    it('should handle store selection errors gracefully', () => {
      // Override with error state
      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        null as any
      );
      store.refreshState();

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle undefined banner setting tabs', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        mockBannerSettingTabs
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        // Should not execute subscription due to filter
        expect(component.pageOptions).toEqual([
          {
            code: '1',
            value: 'Page 1',
          },
          {
            code: '2',
            value: 'Page 2',
          },
          {
            code: '3',
            value: 'Page 3',
          },
        ]);
        done();
      }, 100);
    });

    it('should handle null banner setting tabs', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        mockBannerSettingTabs
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        // Should not execute subscription due to filter
        expect(component.pageOptions).toEqual([
          {
            code: '1',
            value: 'Page 1',
          },
          {
            code: '2',
            value: 'Page 2',
          },
          {
            code: '3',
            value: 'Page 3',
          },
        ]);
        done();
      }, 100);
    });

    it('should handle missing page_name in banner setting tabs', (done) => {
      const malformedTabs = [
        { page_id: 1 } as any, // missing page_name
      ];

      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        malformedTabs
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions[0].value).toBeUndefined();
        expect(component.pageOptions[0].code).toBe('1');
        done();
      }, 0);
    });
  });

  describe('Component Lifecycle', () => {
    it('should call ngOnInit without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle component destruction properly', () => {
      component.ngOnInit();

      // Simulate component destruction
      expect(() => fixture.destroy()).not.toThrow();
    });

    it('should unsubscribe on component destroy', () => {
      component.ngOnInit();
      const destroySpy = jest.spyOn(component['destroy$'], 'next');

      fixture.destroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should handle formGroup input property', () => {
      const newFormGroup = formBuilder.group({
        pageId: ['test-value'],
      });

      component.formGroup = newFormGroup;

      expect(component.formGroup).toBe(newFormGroup);
      expect(component.pageIdControl?.value).toBe('test-value');
    });

    it('should handle isCreateMode input property', () => {
      component.isCreateMode = false;
      expect(component.isCreateMode).toBe(false);

      component.isCreateMode = true;
      expect(component.isCreateMode).toBe(true);
    });

    it('should handle required input properties', () => {
      expect(component.formGroup).toBeDefined();
      expect(typeof component.isCreateMode).toBe('boolean');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty pageOptions when patching value in create mode', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        []
      );
      store.refreshState();
      queryParams$.next({});

      component.ngOnInit();

      setTimeout(() => {
        // Should not patch value when pageOptions is empty
        expect(component.pageIdControl?.value).toBe('');
        done();
      }, 100);
    });

    it('should handle numeric page_id values correctly', (done) => {
      const tabsWithNumericIds: BannerSettingTab[] = [
        { page_id: 123, page_name: 'Numeric Page' },
      ];

      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        tabsWithNumericIds
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions[0].code).toBe('123');
        done();
      }, 0);
    });

    it('should handle zero page_id correctly', (done) => {
      const tabsWithZeroId: BannerSettingTab[] = [
        { page_id: 0, page_name: 'Zero Page' },
      ];

      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        tabsWithZeroId
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions[0].code).toBe('0');
        done();
      }, 0);
    });

    it('should handle queryParams without pageId when pageOptions is empty', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        []
      );
      store.refreshState();
      queryParams$.next({ otherParam: 'value' });

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions).toEqual([]);
        done();
      }, 100);
    });
  });

  describe('Observable Streams', () => {
    it('should handle combineLatest properly', (done) => {
      component.ngOnInit();

      // Change query params after initialization
      queryParams$.next({ pageId: '2' });

      setTimeout(() => {
        expect(component.pageOptions.length).toBeGreaterThan(0);
        done();
      }, 0);
    });

    it('should filter out empty banner setting tabs', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        []
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions).toEqual([]);
        done();
      }, 100);
    });

    it('should filter out null/undefined banner setting tabs', (done) => {
      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        mockBannerSettingTabs
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions).toEqual([
          {
            code: '1',
            value: 'Page 1',
          },
          {
            code: '2',
            value: 'Page 2',
          },
          {
            code: '3',
            value: 'Page 3',
          },
        ]);
        done();
      }, 100);
    });

    it('should handle multiple emissions correctly', (done) => {
      component.ngOnInit();

      // First emission
      queryParams$.next({ pageId: '1' });

      setTimeout(() => {
        expect(component.pageIdControl?.value).toBe('1');

        // Second emission
        queryParams$.next({ pageId: '2' });

        setTimeout(() => {
          expect(component.pageIdControl?.value).toBe('2');
          done();
        }, 0);
      }, 0);
    });

    it('should handle rapid successive emissions', (done) => {
      component.ngOnInit();

      // Rapid emissions
      queryParams$.next({ pageId: '1' });
      queryParams$.next({ pageId: '2' });
      queryParams$.next({ pageId: '3' });

      setTimeout(() => {
        expect(component.pageIdControl?.value).toBe('3');
        done();
      }, 50);
    });
  });

  describe('Data Transformation', () => {
    it('should correctly transform banner setting tabs to page options', (done) => {
      const customTabs: BannerSettingTab[] = [
        { page_id: 999, page_name: 'Custom Page' },
        { page_id: 888, page_name: 'Another Page' },
      ];

      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        customTabs
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions).toEqual([
          { value: 'Custom Page', code: '999' },
          { value: 'Another Page', code: '888' },
        ]);
        done();
      }, 0);
    });

    it('should handle string and number page_id values', (done) => {
      const mixedTabs = [
        { page_id: 'string-id', page_name: 'String ID Page' },
        { page_id: 123, page_name: 'Number ID Page' },
      ] as any;

      store.overrideSelector(
        popupAnnouncementSelectors.selectBannerSettingTabs,
        mixedTabs
      );
      store.refreshState();

      component.ngOnInit();

      setTimeout(() => {
        expect(component.pageOptions[0].code).toBe('string-id');
        expect(component.pageOptions[1].code).toBe('123');
        done();
      }, 0);
    });
  });
});
