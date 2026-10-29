import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from 'src/app/core/services/auth-service';
import { Router, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { SidebarItem } from '../../models/sidebar-item.model';
import { User } from '@app/shared/models/user.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    mockAuthService = {
      getCurrentUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerEvents$ = new Subject();
    mockRouter = {
      navigate: jest.fn(),
      events: routerEvents$.asObservable(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userInfo on ngOnInit', async () => {
    const mockUser: User = {
      id: '1',
      email: 'abc@gmail.com',
      name: 'abc',
      username: 'abc',
    };
    mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

    await component.ngOnInit();

    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(component.userInfo()).toEqual(mockUser);
  });

  it('should call signIn on signIn method', () => {
    component.signIn();
    expect(mockAuthService.signIn).toHaveBeenCalled();
  });

  it('should call signOut on signOut method', () => {
    component.signOut();
    expect(mockAuthService.signOut).toHaveBeenCalled();
  });

  it('should update selectedSidebarCode and toggle collapse on toggerMenu', () => {
    const mockSidebarItem: SidebarItem = {
      code: 'test',
      title: 'test',
      permissions: [],
    };
    component.isSidebarColapsed.set(true);

    component.toggerMenu(mockSidebarItem);

    expect(component.selectedSidebarCode()).toBe('test');
    expect(component.isSidebarColapsed()).toBe(false);
  });

  it('should navigate to child item on selectChildItem', () => {
    const mockSidebarItem: SidebarItem = {
      code: 'parent',
      title: 'parent',
      permissions: [],
      childrens: [],
    };

    component.selectChildItem('child', mockSidebarItem);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['parent', 'child']);
  });

  it('should check if a menu is selected in checkMenuSelected', () => {
    const mockSidebarItem: SidebarItem = {
      code: 'parent',
      title: 'parent',
      permissions: [],
      childrens: [{ code: 'child', title: 'child', permissions: [] }],
    };
    component.selectedChildCode.set('child');

    const isSelected = component.checkMenuSelected(mockSidebarItem);

    expect(isSelected).toBe(true);
  });

  it('should navigate to home on navigateHome', () => {
    component.navigateHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should toggle sidebar collapse state on toggleSidebarColapsed', () => {
    component.isSidebarColapsed.set(false);

    component.toggleSidebarColapsed();

    expect(component.isSidebarColapsed()).toBe(true);
  });

  it('should update selected codes on router NavigationEnd event', () => {
    const mockSidebarItem: SidebarItem = {
      code: 'user-management',
      title: 'User Management',
      permissions: [
        {
          feature: FeaturePermissionCode.CustomerProfile,
          action: ActionPermissionCode.View,
        },
        {
          feature: FeaturePermissionCode.CustomerProfile,
          action: ActionPermissionCode.ViewWithMasking,
        },
        {
          feature: FeaturePermissionCode.CustomerTier,
          action: ActionPermissionCode.View,
        },
        {
          feature: FeaturePermissionCode.CustomerSegmentation,
          action: ActionPermissionCode.View,
        },
      ],
      childrens: [
        {
          title: 'Customer Profile',
          code: 'customer-profile',
          permissions: [
            {
              feature: FeaturePermissionCode.CustomerProfile,
              action: ActionPermissionCode.View,
            },
            {
              feature: FeaturePermissionCode.CustomerProfile,
              action: ActionPermissionCode.ViewWithMasking,
            },
          ],
        },
      ],
    };
    component.sidebarItems.set([mockSidebarItem]);

    routerEvents$.next(new NavigationEnd(1, '/user-management/customer-profile', '/user-management/customer-profile'));

    expect(component.selectedSidebarCode()).toBe('user-management');
    expect(component.selectedChildCode()).toBe('');
  });
});
