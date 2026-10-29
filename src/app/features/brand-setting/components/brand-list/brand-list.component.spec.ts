import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandListComponent } from './brand-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as BrandActions from '../../stores/brand-list/brand-list.actions';
import { of } from 'rxjs';
import { Brand } from '../../../../shared/models/brand-model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BrandListComponent', () => {
  let component: BrandListComponent;
  let fixture: ComponentFixture<BrandListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [BrandListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: 'brandSelectors.selectBrands', value: of([]) },
            { selector: 'brandSelectors.selectPagination', value: of({}) },
            { selector: 'selectIsLoading', value: of(false) },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.hasEditPermission = true;
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setBrandFilters on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      BrandActions.setBrandFilters({
        filters: component.defaultParams(),
      })
    );
  });

  it('should dispatch setBrandFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      BrandActions.setBrandFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setBrandFilters with pageSize on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      BrandActions.setBrandFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should dispatch updateStatusBrand on onToggleChange', () => {
    const event = { checked: true } as MatSlideToggleChange;
    const rowData = { brand_id: 1 } as Brand;

    component.onToggleChange(event, rowData);

    expect(store.dispatch).toHaveBeenCalledWith(
      BrandActions.updateStatusBrand({
        id: rowData.brand_id,
        is_active: event.checked,
      })
    );
  });

  it('should navigate to create brand form on createBrand', () => {
    component.createBrand();
    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'brand-setting',
      'form',
      'create',
    ]);
  });

  it('should navigate to view/edit brand form on onRowClick', () => {
    const brand = { brand_id: 1 } as Brand;

    component.onRowClick(brand);

    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'brand-setting',
      'form',
      brand.brand_id,
      'view-edit',
    ]);
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(BrandActions.resetAll());
  });
});
