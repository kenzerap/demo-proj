import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-pen-square',
  standalone: true,
  imports: [],
  templateUrl: './svg-pen-square.component.html',
  styleUrl: './svg-pen-square.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgPenSquareComponent {
  @Input() color = '#98A2B3';
}
