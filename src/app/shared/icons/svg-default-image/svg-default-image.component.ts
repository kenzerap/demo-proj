import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-default-image',
  standalone: true,
  imports: [],
  templateUrl: './svg-default-image.component.html',
  styleUrl: './svg-default-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgDefaultImageComponent {
  @Input() color = '#475367';
  @Input() width = 26;
  @Input() height = 25;
}
