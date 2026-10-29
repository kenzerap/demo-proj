import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { SvgGroupComponent } from '../../icons/svg-group/svg-group.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { SvgUsersComponent } from '../../icons/svg-users/svg-users.component';
import { SvgPersonComponent } from '../../icons/svg-person/svg-person.component';
import { TargetGroupType } from '../target-group-section/target-group-type.enum';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { targetGroupList } from '../../constants/target-group-list.const';

@Component({
  selector: 'app-target-group-icon',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    SvgGroupComponent,
    SvgUsersComponent,
    SvgPersonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './target-group-icon.component.html',
  styleUrl: './target-group-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetGroupIconComponent {
  @Input() targetGroupControl = new FormControl();

  targetGroupType = TargetGroupType;
  targetGroups: WritableSignal<ValueCode<TargetGroupType>[]> =
    signal(targetGroupList);

  changeGroup(code: TargetGroupType) {
    if (this.targetGroupControl.enabled) {
      this.targetGroupControl.setValue(code);
    }
  }
}
