import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-mobile-banner-setting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-mobile-banner-setting.component.html',
  styleUrl: './svg-mobile-banner-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgMobileBannerSettingComponent {
  @Input() showBanner = false;
}
