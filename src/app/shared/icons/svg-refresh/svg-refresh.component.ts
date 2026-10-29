import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-refresh',
  standalone: true,
  imports: [],
  templateUrl: './svg-refresh.component.html',
  styleUrl: './svg-refresh.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgRefreshComponent {
  @Input() color = '#C62B29';
  @Input() width = 15;
  @Input() height = 15;
}
