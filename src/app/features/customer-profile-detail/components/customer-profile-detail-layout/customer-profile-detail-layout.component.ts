import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterModule,
} from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { customerProfileDetailTabs } from './customer-profile-detail-tabs.const';

@Component({
  selector: 'app-customer-profile-detail-layout',
  standalone: true,
  imports: [RouterModule, MatTabsModule],
  templateUrl: './customer-profile-detail-layout.component.html',
  styleUrl: './customer-profile-detail-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerProfileDetailLayoutComponent
  extends BaseComponent
  implements OnInit
{
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  tabs: WritableSignal<{ label: string; url: string }[]> = signal(
    customerProfileDetailTabs
  );

  activeTabUrl: WritableSignal<string> = signal(
    customerProfileDetailTabs[0].url
  );

  constructor() {
    super();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getActiveTabUrl();
      });
  }

  ngOnInit(): void {
    this.getActiveTabUrl();
  }

  changeTab(url: string) {
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

  getActiveTabUrl() {
    let currentRoute = this.activatedRoute;
    let fullPath = '';

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
      if (currentRoute.snapshot.url.length) {
        fullPath += `${currentRoute.snapshot.url
          .map((segment) => segment.path)
          .join('/')}`;
      }

      const isMatchPath = this.tabs().some((tab) => tab.url === fullPath);

      if (isMatchPath) {
        break;
      }
    }

    this.activeTabUrl.set(fullPath);
  }
}
