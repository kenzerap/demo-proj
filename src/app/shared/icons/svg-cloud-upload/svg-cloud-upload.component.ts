import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg-cloud-upload',
  standalone: true,
  imports: [],
  templateUrl: './svg-cloud-upload.component.html',
  styleUrl: './svg-cloud-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCloudUploadComponent {
  @Input() color = '#475367';
}
