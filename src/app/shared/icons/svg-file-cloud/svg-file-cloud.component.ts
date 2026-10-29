import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-file-cloud',
  standalone: true,
  imports: [],
  templateUrl: './svg-file-cloud.component.html',
  styleUrl: './svg-file-cloud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgFileCloudComponent {
  @Input() color = 'black';
}
