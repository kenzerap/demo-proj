import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-user',
  standalone: true,
  imports: [],
  templateUrl: './svg-user.component.html',
  styleUrl: './svg-user.component.scss',
})
export class SvgUserComponent {
  @Input() color = '#1D2739';
  @Input() width = 19;
  @Input() height = 21;
}
