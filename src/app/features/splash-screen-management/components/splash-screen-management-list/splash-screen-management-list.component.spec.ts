import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreenManagementListComponent } from './splash-screen-management-list.component';
import * as SplashScreenManagementActions from '../../stores/splash-screen-management-list/splash-screen-management-list.actions';
import * as splashScreenManagementSelectors from '../../stores/splash-screen-management-list/splash-screen-management-list.selectors';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { SplashScreenManagement } from '../../models/splash-screen-management.model';

describe('SplashScreenManagementListComponent', () => {
  let component: SplashScreenManagementListComponent;
  let fixture: ComponentFixture<SplashScreenManagementListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [SplashScreenManagementListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: splashScreenManagementSelectors.selectSplashScreenManagements,
              value: of([]),
            },
            {
              selector: splashScreenManagementSelectors.selectPagination,
              value: of({ page: 0, size: 20, totalItems: 0, totalPages: 0 }),
            },
            {
              selector: selectIsLoading('getSplashScreenManagements'),
              value: of(false),
            },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SplashScreenManagementListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.hasEditPermission = true;

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setSplashScreenManagementFilters on ngOnInit', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      SplashScreenManagementActions.setSplashScreenManagementFilters({
        filters: component.defaultParams(),
      })
    );
  });

  it('should dispatch setSplashScreenManagementFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      SplashScreenManagementActions.setSplashScreenManagementFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setSplashScreenManagementFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      SplashScreenManagementActions.setSplashScreenManagementFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should navigate to create splash screen form on createNewScreen', () => {
    component.createNewScreen();
    expect(router.navigate).toHaveBeenCalledWith([
      'application-management',
      'splash-screen-management',
      'form',
      'create',
    ]);
  });

  it('should navigate to view/edit splash screen form on onRowClick', () => {
    const splashScreenManagement = {
      splash_screen_id: 1,
    } as SplashScreenManagement;

    component.onRowClick(splashScreenManagement);

    expect(router.navigate).toHaveBeenCalledWith([
      'application-management',
      'splash-screen-management',
      'form',
      splashScreenManagement.splash_screen_id,
      'view-edit',
    ]);
  });

  it('should not navigate on onRowClick without edit permission', () => {
    component.hasEditPermission = false;
    const splashScreenManagement = {
      splash_screen_id: 1,
    } as SplashScreenManagement;

    component.onRowClick(splashScreenManagement);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(
      SplashScreenManagementActions.resetAll()
    );
  });
});
