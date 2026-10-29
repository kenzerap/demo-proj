import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { encodeImageUrl } from '@app/shared/utils/encode-image-url';
import { SplashScreenManagementListColumns } from '../../constants/splash-screen-management-list-columns.const';
import { SplashScreenManagement } from '../../models/splash-screen-management.model';
import { SplashScreenManagementQueryParams } from '../../models/splash-screen-management-query-params.model';
import * as SplashScreenManagementActions from '../../stores/splash-screen-management-list/splash-screen-management-list.actions';
import * as splashScreenManagementSelectors from '../../stores/splash-screen-management-list/splash-screen-management-list.selectors';

@Component({
  selector: 'app-splash-screen-management-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatButtonModule,
    MatSlideToggleModule,
    SvgPlusComponent,
    HasPermissionsDirective,
  ],
  templateUrl: './splash-screen-management-list.component.html',
  styleUrl: './splash-screen-management-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenManagementListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;
  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.SplashScreenManagement,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    SplashScreenManagementListColumns
  );

  splashScreenManagements$: Observable<SplashScreenManagement[]> =
    this.store.select(
      splashScreenManagementSelectors.selectSplashScreenManagements
    );

  pagination$: Observable<Pagination> = this.store.select(
    splashScreenManagementSelectors.selectPagination
  );

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getSplashScreenManagements')
  );

  defaultParams: WritableSignal<Partial<SplashScreenManagementQueryParams>> =
    signal({
      page: 0,
      size: 20,
    });

  ngOnInit(): void {
    this.store.dispatch(
      SplashScreenManagementActions.setSplashScreenManagementFilters({
        filters: this.defaultParams(),
      })
    );
  }

  onPageChange(page: number) {
    this.store.dispatch(
      SplashScreenManagementActions.setSplashScreenManagementFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      SplashScreenManagementActions.setSplashScreenManagementFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  createNewScreen() {
    this.router.navigate([
      'application-management',
      'splash-screen-management',
      'form',
      'create',
    ]);
  }

  onRowClick(splashScreenManagement: SplashScreenManagement) {
    if (!this.hasEditPermission) {
      return;
    }

    this.router.navigate([
      'application-management',
      'splash-screen-management',
      'form',
      splashScreenManagement.splash_screen_id,
      'view-edit',
    ]);
  }

  encodeImageUrl(url: string, imageName: string): string {
    return encodeImageUrl(url, imageName);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(SplashScreenManagementActions.resetAll());
  }
}
