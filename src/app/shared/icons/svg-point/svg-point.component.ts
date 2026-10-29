import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-point',
  standalone: true,
  imports: [],
  templateUrl: './svg-point.component.html',
  styleUrl: './svg-point.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgPointComponent {
  @Input() color = '#C62B29';
  @Input() width = 54;
  @Input() height = 56;
}
