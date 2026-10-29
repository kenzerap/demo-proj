import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-file-cloud-bg-red',
  standalone: true,
  imports: [],
  templateUrl: './svg-file-cloud-bg-red.component.html',
  styleUrl: './svg-file-cloud-bg-red.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgFileCloudBgRedComponent {
  @Input() color = '#CB1A14';
}
