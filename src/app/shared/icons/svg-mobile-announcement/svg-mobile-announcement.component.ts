import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-mobile-announcement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-mobile-announcement.component.html',
  styleUrl: './svg-mobile-announcement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgMobileAnnouncementComponent {
  @Input() backdrop = false;
}
