import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as ManualCodeRedemptionActions from '../../stores/manual-code-redemption/manual-code-redemption.actions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ManualCodeRedemptionFilterComponent } from './manual-code-redemption-filter.component';

describe('ManualCodeRedemptionFilterComponent', () => {
  let component: ManualCodeRedemptionFilterComponent;
  let fixture: ComponentFixture<ManualCodeRedemptionFilterComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ManualCodeRedemptionFilterComponent,
        MatDatepickerModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({}), provideNativeDateAdapter()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualCodeRedemptionFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hasFilter', () => {
    it('should return false if filters is null', () => {
      expect(component.hasFilter(null as any)).toBe(false);
    });

    it('should return false if all filters are empty', () => {
      expect(component.hasFilter({})).toBe(false);
    });
  });

  describe('onSearch', () => {
    it('should not dispatch if hasFilter returns false', () => {
      jest.spyOn(component, 'hasFilter').mockReturnValue(false);
      component.onSearch();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch setManualCodeRedemptionFilters with correct payload (string)', () => {
      component.searchForm.setValue({
        search_text: 'abc',
      });
      jest.spyOn(component, 'hasFilter').mockReturnValue(true);
      component.onSearch();
      expect(dispatchSpy).toHaveBeenCalledWith(
        ManualCodeRedemptionActions.setManualCodeRedemptionFilters({
          filters: {
            search_text: 'abc',
            page: 0,
            size: 20,
          },
        })
      );
    });
  });

  describe('resetForm', () => {
    it('should reset the form and dispatch resetManualCodeRedemptionFilters', () => {
      component.searchForm.setValue({
        search_text: 'abc',
      });
      component.resetForm();
      expect(component.searchForm.value).toEqual({
        search_text: null,
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        ManualCodeRedemptionActions.resetManualCodeRedemptionFilters()
      );
    });
  });
});
