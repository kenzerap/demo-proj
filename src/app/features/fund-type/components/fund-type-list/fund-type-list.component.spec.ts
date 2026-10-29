import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FundTypeListComponent } from './fund-type-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as FundTypeActions from '../../stores/fund-type-list/fund-type-list.actions';
import * as fundTypeSelectors from '../../stores/fund-type-list/fund-type-list.selectors';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('FundTypeListComponent', () => {
  let component: FundTypeListComponent;
  let fixture: ComponentFixture<FundTypeListComponent>;
  let store: MockStore;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FundTypeListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: fundTypeSelectors.selectFundTypes, value: of([]) },
            {
              selector: fundTypeSelectors.selectPagination,
              value: of({ page: 0, size: 20, totalItems: 2, totalPages: 1 }),
            },
            { selector: selectIsLoading('getFundTypes'), value: of(false) },
            {
              selector: fundTypeSelectors.selectFundTypeFilters,
              value: of({ keyword: 'test' }),
            },
          ],
        }),
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FundTypeListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.hasEditPermission = true;

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setFundTypeFilters on ngOnInit', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      FundTypeActions.setFundTypeFilters({
        filters: component.defaultParams(),
      })
    );
  });

  it('should dispatch setFundTypeFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      FundTypeActions.setFundTypeFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setFundTypeFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      FundTypeActions.setFundTypeFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(FundTypeActions.resetAll());
  });

  it('should navigate to the create Fund Type form on createFundType', () => {
    component.createFundType();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'master-data-management',
      'fund-type',
      'form',
      'create',
    ]);
  });
});
