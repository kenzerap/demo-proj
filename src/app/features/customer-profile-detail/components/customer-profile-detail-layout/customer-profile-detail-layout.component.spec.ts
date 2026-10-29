import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerProfileDetailLayoutComponent } from './customer-profile-detail-layout.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomerProfileDetailLayoutComponent', () => {
  let component: CustomerProfileDetailLayoutComponent;
  let fixture: ComponentFixture<CustomerProfileDetailLayoutComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  const mockTabs = [
    { label: 'Tab 1', url: 'tab1' },
    { label: 'Tab 2', url: 'tab2' },
  ];
  const routerEvents$ = new Subject<any>();

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
      events: routerEvents$.asObservable(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      firstChild: {
        snapshot: { url: [{ path: 'tab1' }] },
        firstChild: null,
      },
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [CustomerProfileDetailLayoutComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfileDetailLayoutComponent);
    component = fixture.componentInstance;
    component.tabs.set(mockTabs);
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize activeTabUrl on ngOnInit', () => {
    jest.spyOn(component, 'getActiveTabUrl');
    component.ngOnInit();
    expect(component.getActiveTabUrl).toHaveBeenCalled();
    expect(component.activeTabUrl()).toBe('tab1');
  });

  it('should navigate to the correct tab on changeTab', () => {
    const url = 'tab2';
    component.changeTab(url);
    expect(mockRouter.navigate).toHaveBeenCalledWith([url], {
      relativeTo: mockActivatedRoute,
    });
  });

  it('should update activeTabUrl on getActiveTabUrl', () => {
    component.getActiveTabUrl();
    expect(component.activeTabUrl()).toBe('tab1');
  });

  it('should update activeTabUrl on router NavigationEnd event', () => {
    routerEvents$.next(new NavigationEnd(1, '/tab1', '/tab1'));
    expect(component.activeTabUrl()).toBe('tab1');
  });
});
