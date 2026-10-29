import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-star',
  standalone: true,
  imports: [],
  templateUrl: './svg-star.component.html',
  styleUrl: './svg-star.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgStarComponent {
  @Input() color = 'black';
  @Input() width = 16;
  @Input() height = 14;
}
