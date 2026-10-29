import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoCodeListComponent } from './promocode-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import * as PromoCodeActions from '../../stores/promocode-list/promocode-list.actions';
import * as promoCodeSelectors from '../../stores/promocode-list/promocode-list.selectors';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { PromoCode } from '../../models/promocode-model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PromoCodeListComponent', () => {
  let component: PromoCodeListComponent;
  let fixture: ComponentFixture<PromoCodeListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [PromoCodeListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: promoCodeSelectors.selectPromoCodes, value: of([]) },
            {
              selector: promoCodeSelectors.selectPagination,
              value: of({ page: 0, size: 20, totalItems: 2, totalPages: 1 }),
            },
            { selector: selectIsLoading('getPromoCodes'), value: of(false) },
            {
              selector: promoCodeSelectors.selectPromoCodeFilters,
              value: of({ keyword: 'test' }),
            },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PromoCodeListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.hasEditPermission = true;

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setPromoCodeFilters on ngOnInit', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      PromoCodeActions.setPromoCodeFilters({
        filters: component.defaultParams(),
      })
    );
  });

  it('should dispatch setPromoCodeFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      PromoCodeActions.setPromoCodeFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setPromoCodeFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      PromoCodeActions.setPromoCodeFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should navigate to create promocode form on createPromoCode', () => {
    component.createPromoCode();
    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'promocode-setting',
      'form',
      'create',
    ]);
  });

  it('should navigate to view/edit promocode form on onRowClick', () => {
    const mockPromoCode: PromoCode = { promocode_id: 123 } as PromoCode;
    component.onRowClick(mockPromoCode);
    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'promocode-setting',
      'form',
      123,
      'view-edit',
    ]);
  });

  it('should return correct reward name in getRewardName', () => {
    expect(
      component.getRewardName({
        is_point: false,
        is_privilege: false,
      } as PromoCode)
    ).toBe('-');
    expect(
      component.getRewardName({
        is_point: true,
        is_privilege: true,
      } as PromoCode)
    ).toBe('Point, Privilege');
    expect(
      component.getRewardName({
        is_point: true,
        is_privilege: false,
      } as PromoCode)
    ).toBe('Point');
    expect(
      component.getRewardName({
        is_point: false,
        is_privilege: true,
      } as PromoCode)
    ).toBe('Privilege');
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(PromoCodeActions.resetAll());
  });
});
