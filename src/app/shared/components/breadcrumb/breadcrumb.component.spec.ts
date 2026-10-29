import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';
import { Subject } from 'rxjs';
import { Breadcrumb } from '../../models/breadcrumb.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let navigationEvents$: Subject<any>;

  beforeEach(() => {
    navigationEvents$ = new Subject();

    const routerMock = {
      events: navigationEvents$.asObservable(),
      navigateByUrl: jest.fn(),
    };

    const activatedRouteMock = {
      snapshot: {
        data: {},
      },
      firstChild: {
        snapshot: {
          data: {
            breadcrumb: { title: 'Home', url: '/', subTitle: '' },
          },
          url: [{ path: 'home' }],
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize breadcrumbs on NavigationEnd', () => {
    navigationEvents$.next(new NavigationEnd(1, '/', '/'));

    expect(component.breadcrumbs()).toEqual([
      { title: 'Home', url: '/', subTitle: '' },
    ]);
  });

  it('should handle multiple breadcrumbs', () => {
    (activatedRoute.firstChild as any).firstChild = {
      snapshot: {
        data: {
          breadcrumb: { title: 'Dashboard', url: 'dashboard', subTitle: '' },
        },
        url: [{ path: 'dashboard' }],
      },
    };

    navigationEvents$.next(new NavigationEnd(1, '/dashboard', '/dashboard'));

    expect(component.breadcrumbs()).toEqual([
      { title: 'Home', url: '/', subTitle: '' },
      { title: 'Dashboard', url: '/dashboard', subTitle: '' },
    ]);
  });

  it('should navigate back when goBack() is called', () => {
    component.breadcrumbs.set([
      { title: 'Home', url: '/', subTitle: '' },
      { title: 'Dashboard', url: '/dashboard', subTitle: '' },
    ]);

    component.goBack();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/?isBack=false');
  });

  it('should not navigate back if only one breadcrumb exists', () => {
    component.breadcrumbs.set([{ title: 'Home', url: '/', subTitle: '' }]);

    component.goBack();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should update breadcrumbs on router events', () => {
    const breadcrumbData: Breadcrumb = {
      title: 'Profile',
      url: 'profile',
      subTitle: '',
    };
    (activatedRoute.firstChild as any).firstChild = {
      snapshot: {
        data: { breadcrumb: breadcrumbData },
        url: [{ path: 'profile' }],
      },
    };

    navigationEvents$.next(new NavigationEnd(1, '/profile', '/profile'));

    expect(component.breadcrumbs()).toEqual([
      { title: 'Home', url: '/', subTitle: '' },
      { title: 'Profile', url: '/profile', subTitle: '' },
    ]);
  });

  it('should handle empty breadcrumb data', () => {
    (activatedRoute.firstChild as any).firstChild = {
      snapshot: {
        data: {},
        url: [{ path: 'empty' }],
      },
    };

    navigationEvents$.next(new NavigationEnd(1, '/empty', '/empty'));

    expect(component.breadcrumbs()).toEqual([
      { title: 'Home', url: '/', subTitle: '' },
    ]);
  });

  it('should complete destroy$ when ngOnDestroy is called', () => {
    jest.spyOn(component.destroy$, 'next');
    jest.spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(component.destroy$.next).toHaveBeenCalledTimes(1);
    expect(component.destroy$.complete).toHaveBeenCalledTimes(1);
  });
});
