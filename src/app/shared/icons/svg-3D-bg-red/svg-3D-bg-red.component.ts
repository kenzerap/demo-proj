import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-3D-bg-red',
  standalone: true,
  imports: [],
  templateUrl: './svg-3D-bg-red.component.html',
  styleUrl: './svg-3D-bg-red.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Svg3DBgRedComponent {
  @Input() color = '#CB1A14';
}
