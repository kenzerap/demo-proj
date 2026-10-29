import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-defective-thin-circle',
  standalone: true,
  imports: [],
  templateUrl: './svg-defective-thin-circle.component.html',
  styleUrl: './svg-defective-thin-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgDefectiveThinCircleComponent {
  @Input() color = '#E9EDF0';
  @Input() width = 153;
  @Input() height = 139;
}
