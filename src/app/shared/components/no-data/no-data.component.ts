import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoDataComponent {
  @Input() imgUrl = 'telescope.svg';
  @Input() title = 'No data available';
  @Input() subTitle = '';
}
