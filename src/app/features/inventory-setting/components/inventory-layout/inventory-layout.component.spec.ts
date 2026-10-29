import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryLayoutComponent } from './inventory-layout.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  UrlSegment,
} from '@angular/router';
import { Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InventoryLayoutComponent', () => {
  let component: InventoryLayoutComponent;
  let fixture: ComponentFixture<InventoryLayoutComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;
  let activatedRoute: jest.Mocked<ActivatedRoute>;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    router = {
      navigate: jest.fn(),
      events: routerEvents$.asObservable(),
    } as unknown as jest.Mocked<Router>;

    activatedRoute = {
      firstChild: {
        snapshot: { url: [{ path: 'tab1' }] },
        firstChild: null,
      },
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [InventoryLayoutComponent, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryLayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize activeTab on ngOnInit', () => {
    jest.spyOn(component, 'getActiveTabUrl');
    component.ngOnInit();
    expect(component.getActiveTabUrl).toHaveBeenCalled();
    expect(component.activeTab()).toBe('tab1');
  });

  it('should update activeTab and navigate on changeTab', () => {
    const tabCode = 'newTab';
    component.changeTab(tabCode);
    expect(component.activeTab()).toBe(tabCode);
    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'inventory-setting',
      'list',
      tabCode,
    ]);
  });

  it('should navigate to create inventory on createInventory', () => {
    component.createInventory();
    expect(router.navigate).toHaveBeenCalledWith([
      'privilege-management',
      'inventory-setting',
      'form',
      'create',
    ]);
  });

  it('should set activeTab based on the current route in getActiveTabUrl', () => {
    activatedRoute.firstChild!.snapshot.url = [
      { path: 'tab2' },
    ] as UrlSegment[];

    component.getActiveTabUrl();

    jest.spyOn(component, 'getActiveTabUrl');
    component.ngOnInit();
    expect(component.getActiveTabUrl).toHaveBeenCalled();
    expect(component.activeTab()).toBe('tab2');
  });

  it('should handle router events and call getActiveTabUrl', () => {
    jest.spyOn(component, 'getActiveTabUrl');
    routerEvents$.next(
      new NavigationEnd(1, '/inventory-setting', '/inventory-setting')
    );
    expect(component.getActiveTabUrl).toHaveBeenCalled();
  });
});
