import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { SvgMobileBannerSettingComponent } from '../../../../shared/icons/svg-mobile-banner-setting/svg-mobile-banner-setting.component';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'primeng/carousel';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as BannerSettingActions from '../../stores/banner-setting/banner-setting.actions';
import * as CreateEditBannerSettingActions from '../../stores/create-edit-banner-setting/create-edit-banner-setting.actions';
import * as CreateEditBannerSettingSelectors from '../../stores/create-edit-banner-setting/create-edit-banner-setting.selectors';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { PreviewImage } from '../../models/preview-image.model';
import { SvgDefaultUserComponent } from '../../../../shared/icons/svg-default-user/svg-default-user.component';
import { SvgDefectiveThinCircleComponent } from '../../../../shared/icons/svg-defective-thin-circle/svg-defective-thin-circle.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TargetGroupsUserSummary } from '@app/shared/models/target-groups-user-summary.model';
import { encodeImageUrl } from '@app/shared/utils/encode-image-url';

@Component({
  selector: 'app-mobile-banner-setting-preview',
  standalone: true,
  imports: [
    CommonModule,
    SvgMobileBannerSettingComponent,
    MatIconModule,
    CarouselModule,
    SvgDefaultUserComponent,
    SvgDefectiveThinCircleComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DecimalPipe,
  ],
  templateUrl: './mobile-banner-setting-preview.component.html',
  styleUrl: './mobile-banner-setting-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBannerSettingPreviewComponent extends BaseComponent {
  private store = inject(Store);

  @Input() images: PreviewImage[] = [];
  @Input() showSummary = false;

  _targetGroupId!: number;
  @Input() set targetGroupId(value: number) {
    this._targetGroupId = value;
    if (value) {
      this.store.dispatch(
        CreateEditBannerSettingActions.getTargetGroupUserSummary({
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
      CreateEditBannerSettingSelectors.selectTargetGroupUserSummary
    );

  encodeImageUrl(url: string, imageName: string): string {
    return encodeImageUrl(url, imageName);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(BannerSettingActions.resetPreviewImages());
  }
}
