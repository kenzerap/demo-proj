import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryListProductComponent } from './inventory-list-product.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as InventoryActions from '../../stores/inventory-list/inventory-list.actions';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InventoryListProductComponent', () => {
  let component: InventoryListProductComponent;
  let fixture: ComponentFixture<InventoryListProductComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryListProductComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: 'inventorySelectors.selectInventories', value: of([]) },
            { selector: 'inventorySelectors.selectPagination', value: of({}) },
            { selector: 'selectIsLoading', value: of(false) },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryListProductComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setInventoryFilters on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      InventoryActions.setInventoryFilters({
        filters: component.defaultParams(),
      })
    );
  });

  it('should dispatch setInventoryFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      InventoryActions.setInventoryFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setInventoryFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      InventoryActions.setInventoryFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(InventoryActions.resetAll());
  });
});
