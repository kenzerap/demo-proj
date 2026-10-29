import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-plus',
  standalone: true,
  imports: [],
  templateUrl: './svg-plus.component.html',
  styleUrl: './svg-plus.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgPlusComponent {
  @Input() color = 'white';
}
