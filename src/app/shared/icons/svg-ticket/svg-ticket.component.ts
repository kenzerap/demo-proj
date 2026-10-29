import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-ticket',
  standalone: true,
  imports: [],
  templateUrl: './svg-ticket.component.html',
  styleUrl: './svg-ticket.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgTicketComponent {
  @Input() color = '#C62B29';
  @Input() width = 24;
  @Input() height = 25;
}
