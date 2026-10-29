import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-file-download',
  standalone: true,
  imports: [],
  templateUrl: './svg-file-download.component.html',
  styleUrl: './svg-file-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgFileDownloadComponent {
  @Input() color = '#CB1A14';
  @Input() width = 16;
  @Input() height = 20;
}
