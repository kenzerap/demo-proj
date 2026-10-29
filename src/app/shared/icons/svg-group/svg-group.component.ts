import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-group',
  standalone: true,
  imports: [],
  templateUrl: './svg-group.component.html',
  styleUrl: './svg-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgGroupComponent {
  @Input() color = 'black';
  @Input() width = 18;
  @Input() height = 21;
}
