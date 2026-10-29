import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Store } from '@ngrx/store';
import { map, Observable, takeUntil, withLatestFrom } from 'rxjs';
import * as BannerSettingActions from '../../stores/banner-setting/banner-setting.actions';
import * as bannerSettingSelectors from '../../stores/banner-setting/banner-setting.selectors';
import * as BannerSettingOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as bannerSettingOrderSelectors from '../../stores/reorder-list/reorder-list.selectors';
import { CommonModule, DatePipe } from '@angular/common';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { bannerSettingListColumns } from '../../constants/banner-setting-list-columns.const';
import {
  BannerSetting,
  BannerSettingTable,
} from '../../models/banner-setting-model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { encodeImageUrl } from '@app/shared/utils/encode-image-url';

@Component({
  selector: 'app-banner-setting-list',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent, MatSlideToggleModule],
  providers: [DatePipe],
  templateUrl: './banner-setting-list.component.html',
  styleUrl: './banner-setting-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerSettingListComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    bannerSettingListColumns
  );
  partyId: WritableSignal<string> = signal('');
  isEditOrderMode: WritableSignal<boolean> = signal(false);

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.BannerSetting,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  selectselectedTargetGroupIds$: Observable<number[] | undefined> =
    this.store.select(bannerSettingSelectors.selectselectedTargetGroupIds);

  bannerSettings$: Observable<BannerSettingTable[]> = this.store
    .select(bannerSettingSelectors.selectBannerSettings)
    .pipe(
      withLatestFrom(
        this.store.select(bannerSettingSelectors.selectTargetGroupUserCounts)
      ),
      map(([bannerSettings, targetGroupUserCount]) => {
        return bannerSettings.map((bannerSetting) => {
          const targetGroupUserItem = targetGroupUserCount.find(
            (targetGroupUser) =>
              targetGroupUser.target_group_ids.includes(
                bannerSetting.target_group_id
              )
          );
          return {
            ...bannerSetting,
            targetGroupName:
              bannerSetting.target_group_id <= 3
                ? targetGroupUserItem?.name || ''
                : 'Target Group',
            dragDisabled: !bannerSetting.is_published,
          };
        });
      })
    );

  virtualBannerSettings$: Observable<BannerSettingTable[]> = this.store
    .select(bannerSettingOrderSelectors.selectVirtualBannerSettings)
    .pipe(
      withLatestFrom(
        this.store.select(bannerSettingSelectors.selectTargetGroupUserCounts)
      ),
      map(([bannerSettings, targetGroupUserCount]) => {
        return bannerSettings.map((bannerSetting) => {
          const targetGroupUserItem = targetGroupUserCount.find(
            (targetGroupUser) =>
              targetGroupUser.target_group_ids.includes(
                bannerSetting.target_group_id
              )
          );
          return {
            ...bannerSetting,
            targetGroupName:
              bannerSetting.target_group_id <= 3
                ? targetGroupUserItem?.name || ''
                : 'Target Group',
            dragDisabled: !bannerSetting.is_published,
          };
        });
      })
    );

  pagination$: Observable<Pagination> = this.store.select(
    bannerSettingSelectors.selectPagination
  );

  isEditOrderMode$: Observable<boolean> = this.store.select(
    bannerSettingOrderSelectors.selectIsEditOrderMode
  );

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getBannerSettings')
  );
  getMissingBannerSettingsLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('getMissingBannerSettings')
  );

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.store.dispatch(
          BannerSettingActions.getTargetGroupUserCount({
            pageId: params['tabId'] || 1,
            page: 0,
          })
        );

        this.store.dispatch(
          BannerSettingActions.setBannerSettingsFilter({
            filters: {
              page_id: Number(params['tabId']) || 1,
              page: 0,
              target_group_ids: [1],
            },
          })
        );
      });

    this.isEditOrderMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isEditOrderMode) => {
        this.isEditOrderMode.set(isEditOrderMode);
      });
  }

  onPageChange(page: number) {
    this.store.dispatch(
      BannerSettingActions.setBannerSettingsFilter({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      BannerSettingActions.setBannerSettingsFilter({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  onRowClick(bannerSetting: BannerSetting) {
    if (!this.hasEditPermission) {
      return;
    }

    if (!this.isEditOrderMode()) {
      this.router.navigate([
        'application-management',
        'banner-setting',
        'form-banner',
        bannerSetting.banner_id,
        'view-edit',
      ]);
    }
  }

  getDateTime(dateString: string, timeString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    const [hour, minute, second] = timeString.split(':').map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
  }

  onDragDropChange(event: DragDropChange<BannerSettingTable>) {
    this.store.dispatch(
      BannerSettingOrderActions.updateBannerSettingsOrder({
        newList: event.data,
      })
    );
  }

  onToggleChange(event: MatSlideToggleChange, rowData: BannerSettingTable) {
    this.store.dispatch(
      BannerSettingOrderActions.updatePublishedStatus({
        id: rowData.banner_id,
        is_published: event.checked,
      })
    );
  }

  encodeImageUrl(url: string, imageName: string): string {
    return encodeImageUrl(url, imageName);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(BannerSettingActions.resetBannerSettings());
    this.store.dispatch(BannerSettingOrderActions.resetAll());
  }
}
