import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-warning-circle',
  standalone: true,
  imports: [],
  templateUrl: './svg-warning-circle.component.html',
  styleUrl: './svg-warning-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgWarningCircleComponent {
  @Input() color = '#F7C164';
  @Input() rectColor = '#FEF6E7';
}
