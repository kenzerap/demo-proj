import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-globe',
  standalone: true,
  imports: [],
  templateUrl: './svg-globe.component.html',
  styleUrl: './svg-globe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgGlobeComponent {
  @Input() color = 'black';
}
