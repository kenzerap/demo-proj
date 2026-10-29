import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-success-circle',
  standalone: true,
  imports: [],
  templateUrl: './svg-success-circle.component.html',
  styleUrl: './svg-success-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgSuccessCircleComponent {
  @Input() color = '#5FC381';
  @Input() rectColor = '#E7F6EC';
  @Input() width = 80;
  @Input() height = 80;
}
