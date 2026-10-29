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
import * as PopupAnnouncementActions from '../../stores/popup-announcement/popup-announcement.actions';
import * as popupAnnouncementSelectors from '../../stores/popup-announcement/popup-announcement.selectors';
import * as PopupAnnouncementOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as PopupAnnouncementOrderSelectors from '../../stores/reorder-list/reorder-list.selectors';
import { CommonModule, DatePipe } from '@angular/common';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { popupAnnouncementListColumns } from '../../constants/popup-announcement-list-columns.const';
import {
  PopupAnnouncement,
  PopupAnnouncementTable,
} from '../../models/popup-announcement-model';
import { Pagination } from '@app/shared/models/paged-data.model';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { DragDropChange } from '@app/shared/components/demoproj-table/models/drag-drop-change.model';
import { HasPermissionService } from '@app/shared/services/has-permission.service';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { encodeImageUrl } from '@app/shared/utils/encode-image-url';

@Component({
  selector: 'app-popup-announcement-list',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent, MatSlideToggleModule],
  providers: [DatePipe],
  templateUrl: './popup-announcement-list.component.html',
  styleUrl: './popup-announcement-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupAnnouncementListComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private hasPermissionService = inject(HasPermissionService);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    popupAnnouncementListColumns
  );
  partyId: WritableSignal<string> = signal('');
  isEditOrderMode: WritableSignal<boolean> = signal(false);

  hasEditPermission = this.hasPermissionService.hasPermission([
    {
      feature: FeaturePermissionCode.PopupAnnouncementSetting,
      action: ActionPermissionCode.CreateEdit,
    },
  ]);

  selectselectedTargetGroupIds$: Observable<number[] | undefined> =
    this.store.select(popupAnnouncementSelectors.selectselectedTargetGroupIds);

  popupAnnouncements$: Observable<PopupAnnouncementTable[]> = this.store
    .select(popupAnnouncementSelectors.selectPopupAnnouncements)
    .pipe(
      withLatestFrom(
        this.store.select(
          popupAnnouncementSelectors.selectTargetGroupUserCounts
        )
      ),
      map(([popupAnnouncements, targetGroupUserCount]) => {
        return popupAnnouncements.map((popupAnnouncement) => {
          const targetGroupUserItem = targetGroupUserCount.find(
            (targetGroupUser) =>
              targetGroupUser.target_group_ids.includes(
                popupAnnouncement.targetGroupId
              )
          );
          return {
            ...popupAnnouncement,
            targetGroupName:
              popupAnnouncement.targetGroupId <= 3
                ? targetGroupUserItem?.name || ''
                : 'Target Group',
            dragDisabled: !popupAnnouncement.isPublished,
          };
        });
      })
    );

  virtualPopupAnnouncements$: Observable<PopupAnnouncementTable[]> = this.store
    .select(PopupAnnouncementOrderSelectors.selectVirtualPopupAnnouncements)
    .pipe(
      withLatestFrom(
        this.store.select(
          popupAnnouncementSelectors.selectTargetGroupUserCounts
        )
      ),
      map(([popupAnnouncements, targetGroupUserCount]) => {
        return popupAnnouncements.map((popupAnnouncement) => {
          const targetGroupUserItem = targetGroupUserCount.find(
            (targetGroupUser) =>
              targetGroupUser.target_group_ids.includes(
                popupAnnouncement.targetGroupId
              )
          );
          return {
            ...popupAnnouncement,
            targetGroupName:
              popupAnnouncement.targetGroupId <= 3
                ? targetGroupUserItem?.name || ''
                : 'Target Group',
            dragDisabled: !popupAnnouncement.isPublished,
          };
        });
      })
    );

  pagination$: Observable<Pagination> = this.store.select(
    popupAnnouncementSelectors.selectPagination
  );

  isEditOrderMode$: Observable<boolean> = this.store.select(
    PopupAnnouncementOrderSelectors.selectIsEditOrderMode
  );

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getPopupAnnouncements')
  );
  getMissingPopupAnnouncementsLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('getMissingPopupAnnouncements')
  );

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.store.dispatch(
          PopupAnnouncementActions.getTargetGroupUserCount({
            pageId: params['tabId'] || 1,
            page: 0,
          })
        );

        this.store.dispatch(
          PopupAnnouncementActions.setPopupAnnouncementsFilter({
            filters: {
              pageId: Number(params['tabId']) || 1,
              page: 0,
              targetGroupIds: [1],
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
      PopupAnnouncementActions.setPopupAnnouncementsFilter({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      PopupAnnouncementActions.setPopupAnnouncementsFilter({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  onRowClick(popupAnnouncement: PopupAnnouncement) {
    if (!this.hasEditPermission) {
      return;
    }

    if (!this.isEditOrderMode()) {
      this.router.navigate([
        'application-management',
        'popup-announcement-setting',
        'form-announcement',
        popupAnnouncement.bannerId,
        'view-edit',
      ]);
    }
  }

  onDragDropChange(event: DragDropChange<PopupAnnouncementTable>) {
    this.store.dispatch(
      PopupAnnouncementOrderActions.updatePopupAnnouncementsOrder({
        newList: event.data,
      })
    );
  }

  onToggleChange(event: MatSlideToggleChange, rowData: PopupAnnouncementTable) {
    this.store.dispatch(
      PopupAnnouncementOrderActions.updatePublishedStatus({
        id: rowData.bannerId,
        is_published: event.checked,
      })
    );
  }

  encodeImageUrl(url: string, imageName: string): string {
    return encodeImageUrl(url, imageName);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(PopupAnnouncementActions.resetPopupAnnouncements());
    this.store.dispatch(PopupAnnouncementOrderActions.resetAll());
  }
}
