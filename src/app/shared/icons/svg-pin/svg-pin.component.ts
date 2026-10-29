import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-pin',
  standalone: true,
  imports: [],
  templateUrl: './svg-pin.component.html',
  styleUrl: './svg-pin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgPinComponent {
  @Input() color = 'white';
  @Input() width = 18;
  @Input() height = 20;
}
