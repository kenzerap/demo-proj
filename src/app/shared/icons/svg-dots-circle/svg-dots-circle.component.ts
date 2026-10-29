import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-dots-circle',
  standalone: true,
  imports: [],
  templateUrl: './svg-dots-circle.component.html',
  styleUrl: './svg-dots-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgDotsCircleComponent {
  @Input() color = '#344054';
  @Input() width = 14;
  @Input() height = 14;
}
