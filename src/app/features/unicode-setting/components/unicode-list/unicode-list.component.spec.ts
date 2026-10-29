import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnicodeListComponent } from './unicode-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import * as UnicodeActions from '../../stores/unicode-list/unicode-list.actions';
import * as unicodeSelectors from '../../stores/unicode-list/unicode-list.selectors';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Unicode } from '../../models/unicode-model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UnicodeListComponent', () => {
  let component: UnicodeListComponent;
  let fixture: ComponentFixture<UnicodeListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [UnicodeListComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: unicodeSelectors.selectUnicodes, value: of([]) },
            { selector: unicodeSelectors.selectPagination, value: of({}) },
            { selector: selectIsLoading('getUnicodes'), value: of(false) },
            {
              selector: unicodeSelectors.selectUnicodeFilters,
              value: of({ keyword: '' }),
            },
          ],
        }),
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UnicodeListComponent);
    component = fixture.componentInstance;
    component.hasEditPermission = true;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setUnicodeFilters on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      UnicodeActions.setUnicodeFilters({
        filters: component.defaultParams(),
      })
    );
  });

  it('should dispatch setUnicodeFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      UnicodeActions.setUnicodeFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setUnicodeFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      UnicodeActions.setUnicodeFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should navigate to create Unicode on createUnicode', () => {
    component.createUnicode();
    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'unicode-setting',
      'form',
      'create',
    ]);
  });

  it('should navigate to view/edit Unicode on onRowClick', () => {
    const unicode: Unicode = { unicode_id: 123 } as Unicode;
    component.onRowClick(unicode);
    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'unicode-setting',
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
      } as Unicode)
    ).toBe('-');
    expect(
      component.getRewardName({ is_point: true, is_privilege: true } as Unicode)
    ).toBe('Point, Privilege');
    expect(
      component.getRewardName({
        is_point: true,
        is_privilege: false,
      } as Unicode)
    ).toBe('Point');
    expect(
      component.getRewardName({
        is_point: false,
        is_privilege: true,
      } as Unicode)
    ).toBe('Privilege');
  });

  it('should dispatch resetAll on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(UnicodeActions.resetAll());
  });
});
