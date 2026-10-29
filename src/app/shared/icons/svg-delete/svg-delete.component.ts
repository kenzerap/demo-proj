import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-delete',
  standalone: true,
  imports: [],
  templateUrl: './svg-delete.component.html',
  styleUrl: './svg-delete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgDeleteComponent {
  @Input() color = 'black';
  @Input() width = 20;
  @Input() height = 21;
}
