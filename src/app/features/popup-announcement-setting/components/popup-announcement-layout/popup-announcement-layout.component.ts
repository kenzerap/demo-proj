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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base/base.component';
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import * as PopupAnnouncementActions from '../../stores/popup-announcement/popup-announcement.actions';
import * as popupAnnouncementSelectors from '../../stores/popup-announcement/popup-announcement.selectors';
import * as PopupAnnouncementOrderActions from '../../stores/reorder-list/reorder-list.actions';
import * as PopupAnnouncementOrderSelectors from '../../stores/reorder-list/reorder-list.selectors';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { LoadingDirective } from '@app/shared/directives/loading.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { PopupAnnouncementTab } from '../../models/popup-announcement-tabs.model';
import { MobileAnnouncementPreviewComponent } from '../mobile-announcement-preview/mobile-announcement-preview.component';
import { PreviewImage } from '../../models/preview-image.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { Actions, ofType } from '@ngrx/effects';
import { PopupAnnouncement } from '../../models/popup-announcement-model';
import { TargetGroupUserCount } from '@app/shared/models/target-group-user-count.model';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { SvgEyeComponent } from '@app/shared/icons/svg-eye/svg-eye.component';
import { SvgDotsCircleComponent } from '@app/shared/icons/svg-dots-circle/svg-dots-circle.component';

@Component({
  selector: 'app-popup-announcement-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    LoadingDirective,
    MatTooltipModule,
    SvgPlusComponent,
    MobileAnnouncementPreviewComponent,
    MatIconModule,
    HasPermissionsDirective,
    SvgEyeComponent,
    SvgDotsCircleComponent,
  ],
  templateUrl: './popup-announcement-layout.component.html',
  styleUrl: './popup-announcement-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupAnnouncementLayoutComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private actions$ = inject(Actions);

  pageId: WritableSignal<number | undefined> = signal(undefined);
  isEditOrder: WritableSignal<boolean> = signal(false);
  isOrderDirty: WritableSignal<boolean> = signal(false);
  targetGroupUserCountId: WritableSignal<string> = signal('');

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  tabs$: Observable<PopupAnnouncementTab[]> = this.store
    .select(popupAnnouncementSelectors.selectPopupAnnouncementTabs)
    .pipe(
      map((tabs) =>
        tabs.map((tab) => ({ ...tab, page_name: `${tab.page_name} Popup` }))
      )
    );

  activeTab$: Observable<number | undefined> = this.store.select(
    popupAnnouncementSelectors.selectSelectedTab
  );

  targetGroupUserCount$: Observable<TargetGroupUserCount[]> = this.store
    .select(popupAnnouncementSelectors.selectTargetGroupUserCounts)
    .pipe(
      withLatestFrom(
        this.store.select(
          popupAnnouncementSelectors.selectTargetGroupUserCountsPagination
        )
      ),
      map(([users, pagination]) => {
        const newUsers = [
          {
            target_group_ids: [-1],
            name: 'View all popups',
            count: 0,
            id: '-1',
          },
          ...users,
        ];

        // check is last page
        if (pagination.totalPages !== pagination.page + 1) {
          newUsers.push({
            target_group_ids: [-2],
            name: 'See more',
            count: 0,
            id: '-2',
          });
        }
        return newUsers;
      })
    );

  selectselectedTargetGroupIds$: Observable<number[] | undefined> =
    this.store.select(popupAnnouncementSelectors.selectselectedTargetGroupIds);
  popupAnnouncements$: Observable<PopupAnnouncement[]> = this.store.select(
    popupAnnouncementSelectors.selectPopupAnnouncements
  );

  isOrderDirty$: Observable<boolean> = this.store.select(
    PopupAnnouncementOrderSelectors.selectIsOrderDirty
  );

  tabsLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('getPopupAnnouncementTabs')
  );

  targetGroupsLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('getTargetGroupUserCount')
  );

  reOrderLoading$: Observable<boolean> = this.store.select(
    selectIsLoading('reOrderPopupAnnouncements')
  );

  previewImages$: Observable<PreviewImage[]> = this.store.select(
    popupAnnouncementSelectors.selectPreviewImages
  );

  ngOnInit(): void {
    this.store.dispatch(
      PopupAnnouncementActions.getPopupAnnouncementTabs({
        isDropdownOptions: false,
      })
    );

    combineLatest([
      this.store.select(
        popupAnnouncementSelectors.selectselectedTargetGroupIds
      ),
      this.store.select(popupAnnouncementSelectors.selectSelectedTab),
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([targetGroupId, pageId]) => !!targetGroupId && !!pageId)
      )
      .subscribe(([_targetGroupId, pageId]) => {
        this.pageId.set(pageId);
        this.store.dispatch(PopupAnnouncementActions.getPublishedImages());
      });

    this.actions$
      .pipe(
        ofType(PopupAnnouncementOrderActions.reOrderPopupAnnouncementsSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: 'The popup order was updated',
            btnConfirmText: 'Close',
            hideConfirmIcon: true,
            type: 'success',
          },
          width: '25rem',
        });

        dialogRef
          .afterClosed()
          .pipe(take(1))
          .subscribe(() => {
            this.store.dispatch(
              PopupAnnouncementActions.setPopupAnnouncementsFilter({
                filters: { page: 0 },
              })
            );

            this.setEditOrder(false);

            this.store.dispatch(PopupAnnouncementActions.getPublishedImages());
          });
      });

    this.isOrderDirty$.pipe(takeUntil(this.destroy$)).subscribe((isDirty) => {
      this.isOrderDirty.set(isDirty);
    });
  }

  changeTab(page_id: number) {
    this.targetGroupUserCountId.set('');
    this.checkWarningIsEditOrder$()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.setEditOrder(false);
          this.store.dispatch(PopupAnnouncementOrderActions.resetAll());
          this.router.navigate([page_id], {
            relativeTo: this.activatedRoute,
          });
        }
      });
  }

  selectTargetGroup(targetGroupUserCount: TargetGroupUserCount) {
    if (targetGroupUserCount.id === '-2') {
      this.store.dispatch(
        PopupAnnouncementActions.getTargetGroupUserCount({
          pageId: this.pageId() || 0,
          isGetMore: true,
        })
      );
      return;
    }

    this.checkWarningIsEditOrder$()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.targetGroupUserCountId.set(targetGroupUserCount.id);
          this.setEditOrder(false);
          this.store.dispatch(PopupAnnouncementOrderActions.resetAll());
          this.store.dispatch(
            PopupAnnouncementActions.setPopupAnnouncementsFilter({
              filters: {
                targetGroupIds: targetGroupUserCount.target_group_ids,
                page: 0,
              },
            })
          );
        }
      });
  }

  openCreateNewPopupDialog() {
    this.router.navigate(
      [
        'application-management',
        'popup-announcement-setting',
        'form-announcement',
        'create',
      ],
      { queryParams: { pageId: this.pageId() } }
    );
  }

  setEditOrder(isEditOrder: boolean) {
    this.isEditOrder.set(isEditOrder);
    this.store.dispatch(
      PopupAnnouncementOrderActions.setIsEditOrderMode({ isEditOrder })
    );
    if (!isEditOrder) {
      this.store.dispatch(
        PopupAnnouncementOrderActions.setOrderDirty({ isDirty: false })
      );
    }
  }

  publishItems() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'You want to publish changes?',
        message: `The updated order will immediately affect customer-facing views. Please confirm to apply changes or cancel to continue editing.`,
        btnConfirmText: 'Confirm',
        btnCloseText: 'Cancel',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.store.dispatch(
            PopupAnnouncementOrderActions.reOrderPopupAnnouncements()
          );
        }
      });
  }

  cancelEditOrder() {
    if (!this.isOrderDirty()) {
      this.setEditOrder(false);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Discard Changes?',
        message: `You have unsaved changes. If you cancel now, your changes will not be saved. Do you want to continue?`,
        btnConfirmText: 'Discard',
        btnCloseText: 'Cancel',
        type: 'warning',
      },
      width: '25rem',
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.setEditOrder(false);
          this.store.dispatch(PopupAnnouncementOrderActions.resetAll());
          this.store.dispatch(
            PopupAnnouncementActions.setPopupAnnouncementsFilter({
              filters: { page: 0 },
            })
          );
        }
      });
  }

  checkWarningIsEditOrder$(): Observable<boolean> {
    if (this.isEditOrder() && this.isOrderDirty()) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Discard Changes?',
          message: `You have unsaved changes. If you cancel now, your changes will not be saved. Do you want to continue?`,
          btnConfirmText: 'Discard',
          btnCloseText: 'Cancel',
          type: 'warning',
        },
        width: '25rem',
      });

      return dialogRef.afterClosed();
    } else {
      return of(true);
    }
  }

  checkEqualTargetGroupIds(arrayA: number[], arrayB: number[], id: string) {
    if (!this.targetGroupUserCountId()) {
      return (
        JSON.stringify([...arrayA].sort()) ===
        JSON.stringify([...arrayB].sort())
      );
    } else {
      return (
        JSON.stringify([...arrayA].sort()) ===
          JSON.stringify([...arrayB].sort()) &&
        this.targetGroupUserCountId() === id
      );
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(PopupAnnouncementActions.resetAll());
  }
}
