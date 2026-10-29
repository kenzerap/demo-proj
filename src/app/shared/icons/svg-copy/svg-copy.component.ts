import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-copy',
  standalone: true,
  imports: [],
  templateUrl: './svg-copy.component.html',
  styleUrl: './svg-copy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCopyComponent {
  @Input() color = '#344054';
  @Input() width = 20;
  @Input() height = 21;
}
