import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { SvgMobileAnnouncementComponent } from '../../../../shared/icons/svg-mobile-announcement/svg-mobile-announcement.component';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'primeng/carousel';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as PopupAnnouncementActions from '../../stores/popup-announcement/popup-announcement.actions';
import * as CreateEditPopupAnnouncementActions from '../../stores/create-edit-popup-announcement/create-edit-popup-announcement.actions';
import * as CreateEditPopupAnnouncementSelectors from '../../stores/create-edit-popup-announcement/create-edit-popup-announcement.selectors';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { PreviewImage } from '../../models/preview-image.model';
import { SvgDefaultUserComponent } from '../../../../shared/icons/svg-default-user/svg-default-user.component';
import { SvgDefectiveThinCircleComponent } from '../../../../shared/icons/svg-defective-thin-circle/svg-defective-thin-circle.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SegmentSummaryUser } from '@app/shared/models/segment-summary-user.model';
import { TargetGroupsUserSummary } from '@app/shared/models/target-groups-user-summary.model';
import { encodeImageUrl } from '@app/shared/utils/encode-image-url';

@Component({
  selector: 'app-mobile-announcement-preview',
  standalone: true,
  imports: [
    CommonModule,
    SvgMobileAnnouncementComponent,
    MatIconModule,
    CarouselModule,
    SvgDefaultUserComponent,
    SvgDefectiveThinCircleComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DecimalPipe,
  ],
  templateUrl: './mobile-announcement-preview.component.html',
  styleUrl: './mobile-announcement-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileAnnouncementPreviewComponent extends BaseComponent {
  private store = inject(Store);

  @Input() images: PreviewImage[] = [];
  @Input() dontShowButton = false;
  @Input() showSummary = false;

  _targetGroupId!: number;
  @Input() set targetGroupId(value: number) {
    this._targetGroupId = value;
    if (value) {
      this.store.dispatch(
        CreateEditPopupAnnouncementActions.getTargetGroupUserSummary({
          target_group_id: value,
        })
      );
    }
  }
  get targetGroupId() {
    return this._targetGroupId;
  }

  targetGroupUserSummary$: Observable<TargetGroupsUserSummary | null> =
    this.store.select(
      CreateEditPopupAnnouncementSelectors.selectTargetGroupUserSummary
    );

  encodeImageUrl(url: string, imageName: string): string {
    return encodeImageUrl(url, imageName);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(PopupAnnouncementActions.resetPreviewImages());
  }
}
