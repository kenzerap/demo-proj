import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import {
  DestinationCode,
  destinationOptions,
} from '@app/shared/constants/destination-options.const';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Observable, of, takeUntil } from 'rxjs';
import * as CreateEditPushNotificationActions from '../../stores/create-edit-push-notification/create-edit-push-notification.actions';
import * as createEditPushNotificationSelectors from '../../stores/create-edit-push-notification/create-edit-push-notification.selectors';
import { Store } from '@ngrx/store';
import { Privilege } from '../../../../shared/models/privilege.model';
import { urlValidator } from '@app/shared/utils/url-validator';

@Component({
  selector: 'app-setting-destination-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './setting-destination-section.component.html',
  styleUrl: './setting-destination-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingDestinationSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  @Input() formGroup!: FormGroup;
  @Input() isCreateMode!: boolean;

  selectDestinationOptions: ValueCode[] = destinationOptions;
  privilegeOptions: ValueCode[] = [];
  destinationCode = DestinationCode;

  privileges$: Observable<Privilege[]> = this.store.select(
    createEditPushNotificationSelectors.selectPrivileges
  );

  get destinationTypeControl() {
    return this.formGroup?.get('destination_type');
  }
  get destinationValueControl() {
    return this.formGroup?.get('destination_value');
  }

  ngOnInit(): void {
    this.store.dispatch(CreateEditPushNotificationActions.getPrivileges());

    this.privileges$.pipe(takeUntil(this.destroy$)).subscribe((privileges) => {
      const convertOptions = privileges.map((privilege) => ({
        value: privilege.privilegeName,
        code: privilege.privilegeId.toString(),
      }));

      this.privilegeOptions = convertOptions;

      if (this.isCreateMode) {
        this.destinationValueControl?.patchValue(
          this.privilegeOptions[0]?.code,
          {
            emitEvent: false,
          }
        );
      }
    });

    this.destinationTypeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: DestinationCode) => {
        if (value === DestinationCode.URL) {
          this.destinationValueControl?.setValidators([
            Validators.required,
            urlValidator,
          ]);
          this.destinationValueControl?.reset('');
        } else if (value === DestinationCode.Privilege) {
          this.destinationValueControl?.setValidators([Validators.required]);
          this.destinationValueControl?.patchValue(
            this.privilegeOptions[0]?.code,
            { emitEvent: false }
          );
        } else {
          this.destinationValueControl?.setValidators([]);
          this.destinationValueControl?.reset('');
        }
        this.destinationValueControl?.updateValueAndValidity();
      });
  }

  getDropdownValue(
    selectedCode: string | null,
    dropdownOptions: ValueCode[]
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }
}
