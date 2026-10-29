import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-verified-user',
  standalone: true,
  imports: [],
  templateUrl: './svg-verified-user.component.html',
  styleUrl: './svg-verified-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgVerifiedUserComponent {
  @Input() color = 'black';
}
