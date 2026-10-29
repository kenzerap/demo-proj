import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-btn-back',
  standalone: true,
  imports: [],
  templateUrl: './svg-btn-back.component.html',
  styleUrl: './svg-btn-back.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgBtnBackComponent {
  @Input() color = 'black';
}
