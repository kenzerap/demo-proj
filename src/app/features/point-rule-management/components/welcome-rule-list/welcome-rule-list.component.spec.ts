import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeRuleListComponent } from './welcome-rule-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PointRule } from '../../models/point-rule-model';
import * as PointRuleActions from '../../stores/point-rule-list/point-rule-list.actions';
import { CategoryCode } from '../../constants/category-options.const';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WelcomeRuleListComponent', () => {
  let component: WelcomeRuleListComponent;
  let fixture: ComponentFixture<WelcomeRuleListComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [WelcomeRuleListComponent, NoopAnimationsModule],
      providers: [provideMockStore(), { provide: Router, useValue: router }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeRuleListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.hasEditPermission = true;
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have tableColumns signal with correct columns', () => {
    expect(Array.isArray(component.tableColumns())).toBe(true);
  });

  it('should dispatch setPointRuleFilters on ngOnInit', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      PointRuleActions.setPointRuleFilters({
        filters: component.defaultParams(),
      })
    );
  });

  it('should dispatch setPointRuleFilters with page on onPageChange', () => {
    component.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      PointRuleActions.setPointRuleFilters({
        filters: { page: 2 },
      })
    );
  });

  it('should dispatch setPointRuleFilters with size and reset page on onPageSizeChange', () => {
    component.onPageSizeChange(50);
    expect(store.dispatch).toHaveBeenCalledWith(
      PointRuleActions.setPointRuleFilters({
        filters: { size: 50, page: 0 },
      })
    );
  });

  it('should navigate to view/edit form on onRowClick', () => {
    const mockPointRule: PointRule = { point_rule_id: 123 } as PointRule;
    component.onRowClick(mockPointRule);
    expect(router.navigate).toHaveBeenCalledWith([
      'point-management',
      'point-rule-management',
      'form',
      123,
      'view-edit',
    ]);
  });

  it('should clean up on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(PointRuleActions.resetAll());
  });

  it('should have correct defaultParams signal value', () => {
    expect(component.defaultParams()).toEqual({
      page: 0,
      size: 20,
      category: CategoryCode.WelcomeRule,
      keyword: '',
    });
  });
});
