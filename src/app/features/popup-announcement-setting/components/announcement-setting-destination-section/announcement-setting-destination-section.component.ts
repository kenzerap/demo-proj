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
import * as CreateEditPopupAnnouncementActions from '../../stores/create-edit-popup-announcement/create-edit-popup-announcement.actions';
import * as createEditPopupAnnouncementSelectors from '../../stores/create-edit-popup-announcement/create-edit-popup-announcement.selectors';
import { Store } from '@ngrx/store';
import { Privilege } from '@app/shared/models/privilege.model';

@Component({
  selector: 'app-announcement-setting-destination-section',
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
  templateUrl: './announcement-setting-destination-section.component.html',
  styleUrl: './announcement-setting-destination-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementSettingDestinationSectionComponent
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
    createEditPopupAnnouncementSelectors.selectPrivileges
  );

  get destinationTypeControl() {
    return this.formGroup?.get('destination_type');
  }
  get destinationValueControl() {
    return this.formGroup?.get('destination_value');
  }

  ngOnInit(): void {
    this.store.dispatch(CreateEditPopupAnnouncementActions.getPrivileges());

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
        if (
          value === DestinationCode.Privilege ||
          value === DestinationCode.URL
        ) {
          this.destinationValueControl?.setValidators([Validators.required]);
        } else {
          this.destinationValueControl?.setValidators([]);
        }

        if (value === DestinationCode.Privilege) {
          this.destinationValueControl?.patchValue(
            this.privilegeOptions[0]?.code,
            { emitEvent: false }
          );
        } else {
          this.destinationValueControl?.reset('');
        }
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
