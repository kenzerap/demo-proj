import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-export',
  standalone: true,
  imports: [],
  templateUrl: './svg-export.component.html',
  styleUrl: './svg-export.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgExportComponent {
  @Input() color = 'white';
  @Input() width = 18;
  @Input() height = 22;
}
