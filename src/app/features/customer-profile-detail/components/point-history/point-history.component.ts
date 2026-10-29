import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, Observable, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { pointHistoryTabs } from './point-history-tabs.const';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromAnalyticSummaryActions from '../../stores/analytic-summary/analytic-summary.actions';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import * as fromPointHistoryActions from '../../stores/point-history/point-history.actions';
import { CustomerPoint } from '../../models/customer-point.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatDialog } from '@angular/material/dialog';
import { AddPointComponent } from '../add-point/add-point.component';
import { SvgDeleteComponent } from '../../../../shared/icons/svg-delete/svg-delete.component';
import { DeletePointComponent } from '../delete-point/delete-point.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { SvgExportComponent } from '@app/shared/icons/svg-export/svg-export.component';
import { selectIsLoading } from '@app/store/loading/loading.selectors';

@Component({
  selector: 'app-point-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    SvgPlusComponent,
    SvgDeleteComponent,
    HasPermissionsDirective,
    SvgExportComponent,
  ],
  templateUrl: './point-history.component.html',
  styleUrl: './point-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointHistoryComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);
  private dialog = inject(MatDialog);

  tabs: WritableSignal<{ label: string; url: string }[]> =
    signal(pointHistoryTabs);
  partyId: WritableSignal<string> = signal('');

  activeTabUrl: WritableSignal<string> = signal(pointHistoryTabs[0].url);
  customerPoint$: Observable<CustomerPoint | null> = this.store.select(
    fromAnalyticSummarySelectors.selectCustomerPoint
  );
  exportLoading$ = this.store.select(selectIsLoading(`exportPointToExcel`));

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

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

    this.activatedRoute.parent?.params
      .pipe(
        filter((params) => !!params['party_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.partyId.set(params['party_id']);

        this.store.dispatch(
          fromAnalyticSummaryActions.getCustomerPoint({
            partyId: this.partyId(),
          })
        );
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
    }

    this.activeTabUrl.set(fullPath);
  }

  openAddPointDialog() {
    this.dialog.open(AddPointComponent, {
      data: {
        partyId: this.partyId(),
      },
      autoFocus: false,
      width: '35rem',
    });
  }

  openDeletePointDialog() {
    this.dialog.open(DeletePointComponent, {
      data: {
        partyId: this.partyId(),
      },
      autoFocus: false,
      width: '35rem',
    });
  }

  exportToExcel(): void {
    const file_name =
      this.activeTabUrl() === pointHistoryTabs[0].url
        ? `Point_History_${this.partyId}_[ExportDate].xlsx`
        : `Point_Expire_${this.partyId}_[ExportDate].xlsx`;

    this.store.dispatch(
      fromPointHistoryActions.exportPointToExcel({
        file_name,
        partyId: this.partyId(),
        exportType: this.activeTabUrl() === pointHistoryTabs[0].url ? 'history' : 'expire'
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(fromAnalyticSummaryActions.reset());
  }
}
