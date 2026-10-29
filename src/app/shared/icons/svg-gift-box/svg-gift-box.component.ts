import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-gift-box',
  standalone: true,
  imports: [],
  templateUrl: './svg-gift-box.component.html',
  styleUrl: './svg-gift-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgGiftBoxComponent {
  @Input() color = '#C62B29';
  @Input() width = 63;
  @Input() height = 57;
}
