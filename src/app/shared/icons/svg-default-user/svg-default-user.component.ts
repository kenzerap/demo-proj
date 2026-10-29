import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-default-user',
  standalone: true,
  imports: [],
  templateUrl: './svg-default-user.component.html',
  styleUrl: './svg-default-user.component.scss',
})
export class SvgDefaultUserComponent {
  @Input() color = '#C62B29';
  @Input() width = 22;
  @Input() height = 29;
}
