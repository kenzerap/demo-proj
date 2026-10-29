import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { AuthService } from 'src/app/core/services/auth-service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { TitleWithIconsComponent } from '../title-with-icons/title-with-icons.component';
import { sidebarItemsMenu } from '../../constants/sidebar-items-menu.const';
import { SidebarItem } from '../../models/sidebar-item.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { filter, Observable, takeUntil } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { Store } from '@ngrx/store';
import { selectPermissions } from '@app/store/user-permission/user-permission.selectors';
import { getSidebarItemsByPermission } from './get-sidebar-items-by-permission.const';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    MatExpansionModule,
    MatIconModule,
    TitleWithIconsComponent,
    HasPermissionsDirective,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropDownAnimation', [
      transition(':enter', [
        style({ height: '0', opacity: 0, display: 'none' }),
        animate(
          '200ms linear',
          style({ height: '*', opacity: 1, display: '*' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms linear',
          style({ height: '0', opacity: 0, display: 'none' })
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent extends BaseComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  private store = inject(Store);

  permissions$: Observable<{ [key: string]: string[] }> =
    this.store.select(selectPermissions);
  permissions: WritableSignal<{ [key: string]: string[] }> = signal({});

  userInfo: WritableSignal<User | null> = signal(null);
  sidebarItems: WritableSignal<SidebarItem[]> = signal(sidebarItemsMenu);
  selectedSidebarCode: WritableSignal<string> = signal(
    this.sidebarItems()[0].code
  );
  selectedChildCode: WritableSignal<string> = signal('');
  isSidebarColapsed: WritableSignal<boolean> = signal(false);

  constructor() {
    super();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        const currentUrl = event.urlAfterRedirects;
        const newSidebarItems = getSidebarItemsByPermission(this.permissions());
        this.sidebarItems.set(newSidebarItems);

        this.sidebarItems().forEach((sidebarItem) => {
          const isMatchParentUrl = currentUrl.includes(sidebarItem.code);
          const matchChildUrl = (sidebarItem.childrens || [])?.find(
            (childItem) => currentUrl.includes(childItem.code)
          );
          if (isMatchParentUrl && matchChildUrl) {
            this.selectedSidebarCode.set(sidebarItem.code);
            this.selectedChildCode.set(matchChildUrl.code);
          }
        });
      });

    this.permissions$.subscribe((permissions) => {
      this.permissions.set(permissions);
    });
  }

  async ngOnInit() {
    const userInfo = await this.authService.getCurrentUser();
    this.userInfo.set(userInfo);
  }

  signIn() {
    this.authService.signIn();
  }

  signOut() {
    this.authService.signOut();
  }

  toggerMenu(selectedItem: SidebarItem) {
    this.selectedSidebarCode.set(selectedItem.code);
    if (this.isSidebarColapsed()) {
      this.toggleSidebarColapsed();
    }
  }

  selectChildItem(selectedChildItemCode: string, sidebarNode: SidebarItem) {
    this.router.navigate([sidebarNode.code, selectedChildItemCode]);
  }

  checkMenuSelected(selectedItem: SidebarItem): boolean {
    return (selectedItem.childrens || [])?.some(
      (item) => item.code === this.selectedChildCode()
    );
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  toggleSidebarColapsed() {
    this.isSidebarColapsed.update((value) => !value);
  }
}
