import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-save-file',
  standalone: true,
  imports: [],
  templateUrl: './svg-save-file.component.html',
  styleUrl: './svg-save-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgSaveFileComponent {
  @Input() color = '#C62B29';
}
