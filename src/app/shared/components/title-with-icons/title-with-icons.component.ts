import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-title-with-icons',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './title-with-icons.component.html',
  styleUrl: './title-with-icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleWithIconsComponent {
  @Input() leftImg = '';
  @Input() textContent = '';
  @Input() matIconRight = '';
  @Input() itemSelected = false;
  @Output() itemClicked = new EventEmitter<void>();

  onClickItem() {
    this.itemClicked.emit();
  }
}
