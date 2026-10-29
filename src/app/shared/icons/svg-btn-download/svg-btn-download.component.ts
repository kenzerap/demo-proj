import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-btn-download',
  standalone: true,
  imports: [],
  templateUrl: './svg-btn-download.component.html',
  styleUrl: './svg-btn-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgBtnDownloadComponent {
  @Input() color = '#CB1A14';
}
