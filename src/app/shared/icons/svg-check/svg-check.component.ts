import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-check',
  standalone: true,
  imports: [],
  templateUrl: './svg-check.component.html',
  styleUrl: './svg-check.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCheckComponent {
  @Input() color = '#CB1A14';
}
