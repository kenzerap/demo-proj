import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-eye',
  standalone: true,
  imports: [],
  templateUrl: './svg-eye.component.html',
  styleUrl: './svg-eye.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgEyeComponent {
  @Input() color = '#344054';
  @Input() width = 14;
  @Input() height = 8;
}
