import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { SvgMobileNotificationComponent } from '../../../../shared/icons/svg-mobile-notification/svg-mobile-notification.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SvgDefaultUserComponent } from '@app/shared/icons/svg-default-user/svg-default-user.component';
import * as CreateEditPushNotificationActions from '../../stores/create-edit-push-notification/create-edit-push-notification.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SvgDefectiveThinCircleComponent } from '../../../../shared/icons/svg-defective-thin-circle/svg-defective-thin-circle.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import * as createEditPushNotificationSelectors from '../../stores/create-edit-push-notification/create-edit-push-notification.selectors';
import { TargetGroupsUserSummary } from '@app/shared/models/target-groups-user-summary.model';

@Component({
  selector: 'app-mobile-preview',
  standalone: true,
  imports: [
    CommonModule,
    SvgMobileNotificationComponent,
    MatProgressSpinnerModule,
    SvgDefaultUserComponent,
    SvgDefectiveThinCircleComponent,
  ],
  templateUrl: './mobile-preview.component.html',
  styleUrl: './mobile-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobilePreviewComponent extends BaseComponent {
  private store = inject(Store);

  _targetGroupId!: number;
  @Input() set targetGroupId(value: number) {
    this._targetGroupId = value;
    if (value) {
      this.store.dispatch(
        CreateEditPushNotificationActions.getTargetGroupUserSummary({
          target_group_id: value,
        })
      );
    }
  }
  get targetGroupId() {
    return this._targetGroupId;
  }

  previewMessage$: Observable<{
    title: string;
    body: string;
  }> = this.store.select(
    createEditPushNotificationSelectors.selectPreviewMessage
  );

  targetGroupUserSummary$: Observable<TargetGroupsUserSummary | null> =
    this.store.select(
      createEditPushNotificationSelectors.selectTargetGroupUserSummary
    );
}
