import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-calendar',
  standalone: true,
  imports: [],
  templateUrl: './svg-calendar.component.html',
  styleUrl: './svg-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCalendarComponent {
  @Input() color = '#667185';
}
