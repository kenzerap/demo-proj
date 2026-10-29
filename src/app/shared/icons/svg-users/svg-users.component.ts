import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-users',
  standalone: true,
  imports: [],
  templateUrl: './svg-users.component.html',
  styleUrl: './svg-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgUsersComponent {
  @Input() color = 'black';
  @Input() width = 20;
  @Input() height = 20;
}
