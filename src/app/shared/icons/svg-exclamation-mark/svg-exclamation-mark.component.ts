import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-exclamation-mark',
  standalone: true,
  imports: [],
  templateUrl: './svg-exclamation-mark.component.html',
  styleUrl: './svg-exclamation-mark.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgExclamationMarkComponent {
  @Input() color = '#C62B29';
  @Input() width = 22;
  @Input() height = 20;
}
