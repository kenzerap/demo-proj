import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, map, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../models/breadcrumb.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '../base/base.component';
import { SvgBtnBackComponent } from '../../icons/svg-btn-back/svg-btn-back.component';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule, SvgBtnBackComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent extends BaseComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  breadcrumbs: WritableSignal<Breadcrumb[]> = signal([]);

  constructor() {
    super();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          const breadcrumbs: Breadcrumb[] = [];
          let currentRoute = route;
          let url = '';

          while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;

            if (currentRoute.snapshot.data['breadcrumb']) {
              const breadcrumbData: Breadcrumb =
                currentRoute.snapshot.data['breadcrumb'];

              url += breadcrumbData.url
                ? breadcrumbData.url
                : `/${currentRoute.snapshot.url
                    .map((segment) => segment.path)
                    .join('/')}`;

              if (breadcrumbData.title) {
                breadcrumbs.push({
                  url,
                  title: breadcrumbData.title,
                  subTitle: breadcrumbData.subTitle,
                });
              }
            }
          }
          return breadcrumbs;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((breadcrumbs) => {
        this.breadcrumbs.set(breadcrumbs);
      });
  }

  goBack() {
    if (this.breadcrumbs().length < 2) {
      return;
    }
    const previousUrl = this.breadcrumbs()[this.breadcrumbs().length - 2].url;
    let isBack = false;
    if (previousUrl === 'user-management/customer-profile' || previousUrl === 'privilege-management/privilege-setting') {
      isBack = true;
    }

    this.router.navigateByUrl(`${previousUrl}?isBack=${isBack}`);
  }
}
