import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-group-bg-red',
  standalone: true,
  imports: [],
  templateUrl: './svg-group-bg-red.component.html',
  styleUrl: './svg-group-bg-red.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgGroupBgRedComponent {
  @Input() color = '#CB1A14';
}
