import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-compass',
  standalone: true,
  imports: [],
  templateUrl: './svg-compass.component.html',
  styleUrl: './svg-compass.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCompassComponent {
  @Input() color = 'black';
}
