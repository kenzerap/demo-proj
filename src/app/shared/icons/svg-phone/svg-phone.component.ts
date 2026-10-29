import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-phone',
  standalone: true,
  imports: [],
  templateUrl: './svg-phone.component.html',
  styleUrl: './svg-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgPhoneComponent {
  @Input() color = 'black';
}
