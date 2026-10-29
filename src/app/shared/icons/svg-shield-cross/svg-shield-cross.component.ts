import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-shield-cross',
  standalone: true,
  imports: [],
  templateUrl: './svg-shield-cross.component.html',
  styleUrl: './svg-shield-cross.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgShieldCrossComponent {
  @Input() color = '#F3A218';
  @Input() width = 18;
  @Input() height = 21;
}
