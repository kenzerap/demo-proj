import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-birthday-cake',
  standalone: true,
  imports: [],
  templateUrl: './svg-birthday-cake.component.html',
  styleUrl: './svg-birthday-cake.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgBirthdayCakeComponent {
  @Input() color = 'black';
}
