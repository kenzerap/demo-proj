import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-edit',
  standalone: true,
  imports: [],
  templateUrl: './svg-edit.component.html',
  styleUrl: './svg-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgEditComponent {
  @Input() color = '#C62B29';
  @Input() width = 58;
  @Input() height = 53;
}
