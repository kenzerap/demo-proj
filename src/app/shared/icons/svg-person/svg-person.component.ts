import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-person',
  standalone: true,
  imports: [],
  templateUrl: './svg-person.component.html',
  styleUrl: './svg-person.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgPersonComponent {
  @Input() color = 'black';
  @Input() width = 12;
  @Input() height = 15;
}
