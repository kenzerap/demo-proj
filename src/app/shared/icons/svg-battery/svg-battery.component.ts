import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-battery',
  standalone: true,
  imports: [],
  templateUrl: './svg-battery.component.html',
  styleUrl: './svg-battery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgBatteryComponent {
  @Input() color = 'black';
}
