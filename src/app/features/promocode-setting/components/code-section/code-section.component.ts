import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Store } from '@ngrx/store';
import * as CreateEditPromocodeActions from '../../stores/create-edit-promocode/create-edit-promocode.actions';
import * as CreateEditPromocodeSelectors from '@app/features/promocode-setting/stores/create-edit-promocode/create-edit-promocode.selectors';
import { combineLatest, filter, map, Observable, takeUntil } from 'rxjs';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { DemoprojInputComponent } from '../../../../shared/components/demoproj-input/demoproj-input.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { requireDependValidator } from '@app/shared/utils/require-depend-validator';
import { DemoprojAutocompleteDropdownComponent } from '@app/shared/components/demoproj-autocomplete-dropdown/demoproj-autocomplete-dropdown.component';
import { GroupOption } from '@app/shared/components/demoproj-autocomplete-dropdown/models/group-option.model';
import { PolicyChannel } from '@app/shared/models/policy-channel.model';
import { PromocodeDetail } from '../../models/promocode-model';
import { PromocodeCode } from '../../models/create-edit-promocode-query-params.model';
import { v4 as uuidv4 } from 'uuid';
import { isEmptyValue } from '@app/shared/utils/is-empty-value';
import { ValueCode } from '@app/shared/models/value-code.model';

@Component({
  selector: 'app-code-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    SvgPlusComponent,
    MatButtonModule,
    DemoprojInputComponent,
    MatCheckboxModule,
    DemoprojAutocompleteDropdownComponent,
  ],
  templateUrl: './code-section.component.html',
  styleUrl: './code-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSectionComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private changeDetection = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  promocodeDetail$: Observable<PromocodeDetail | null> = this.store.select(
    CreateEditPromocodeSelectors.selectPromocodeDetail
  );
  channelOptions$: Observable<ValueCode[]> = this.store
    .select(CreateEditPromocodeSelectors.selectPolicyChannels)
    .pipe(
      map((policyChannels) => {
        return policyChannels.map((item) => {
          return {
            code: item.name,
            value: item.name,
          } as ValueCode;
        });
      })
    );

  get isShareQuotaAllocationControl() {
    return this.formGroup?.get('is_share_quota_allocation');
  }
  get sharedQuotaControl() {
    return this.formGroup?.get('sharedQuota');
  }
  get sharedCodeControl() {
    return this.formGroup?.get('sharedCode');
  }
  get sharedRedeemedQuotaControl() {
    return this.formGroup?.get('sharedRedeemedQuota');
  }
  get codesFormArray(): FormArray {
    return this.formGroup.get('codes') as FormArray;
  }

  ngOnInit(): void {
    this.reValidateForm();

    this.store.dispatch(CreateEditPromocodeActions.getPolicyChannels());

    combineLatest([this.channelOptions$, this.promocodeDetail$])
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ([policyChannels, _promocodeDetail]) => policyChannels.length > 0
        )
      )
      .subscribe(([policyChannels, promocodeDetail]) => {
        if (this.formMode !== 'create' && promocodeDetail) {
          let codes: any[] = [];
          if (promocodeDetail?.is_share_quota_allocation) {
            if (
              promocodeDetail.codes[0].channel.length === 0 &&
              promocodeDetail.codes[0].code
            ) {
              codes = [
                {
                  code: '',
                  channel: '',
                  quota: '',
                  redeemed_quota: promocodeDetail.codes[0].redeemed_quota || 0,
                },
              ];
            } else {
              codes = promocodeDetail.codes[0].channel.map((channel) => {
                return {
                  code: '',
                  channel,
                  quota: '',
                  redeemed_quota: promocodeDetail.codes[0].redeemed_quota || 0,
                };
              });
            }

            this.sharedQuotaControl?.setValidators([
              (control) =>
                requireDependValidator(
                  control,
                  this.isShareQuotaAllocationControl?.value,
                  true
                ),
              (control) =>
                this.minRedeemedValidator(
                  control,
                  promocodeDetail.codes[0].quota || 0,
                  this.sharedRedeemedQuotaControl?.getRawValue()
                ),
              Validators.max(20000),
            ]);
          } else {
            codes = promocodeDetail.codes.map((item) => {
              return {
                code: item.code,
                channel: item.channel[0],
                quota: item.quota,
                redeemed_quota: item.redeemed_quota || 0,
              };
            });
          }

          this.codesFormArray.clear();
          codes.map((value) => {
            this.addCode(value);
          });

          if (this.formMode === 'view') {
            this.formGroup.disable();
          }

          this.changeDetection.detectChanges();
          this.formGroup.markAsUntouched();
        }
      });

    this.isShareQuotaAllocationControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formMode !== 'view')
      )
      .subscribe(() => {
        (this.codesFormArray?.controls || []).forEach((control) => {
          control.get('quota')?.reset();
          control.get('code')?.reset();
        });
        this.sharedQuotaControl?.reset();
        this.sharedCodeControl?.reset();
        this.reValidateChannels();
      });
  }

  getCodeFormGroup(index: number): FormGroup {
    return this.codesFormArray.at(index) as FormGroup;
  }

  removePackage(index: number) {
    this.codesFormArray.removeAt(index);
    this.reValidateChannels();
  }

  addCode(value: any = null) {
    const tempId = uuidv4();
    this.codesFormArray.push(
      this.fb.group({
        tempId: [tempId],
        code: [
          value ? value.code : '',
          [
            (control: FormControl) =>
              requireDependValidator(
                control,
                !this.isShareQuotaAllocationControl?.value,
                true
              ),
          ],
        ],
        channel: [
          value ? value.channel : null,
          [
            (control: FormControl) =>
              this.checkSameChannelValidator(control, tempId),
          ],
        ],
        quota: [
          value ? value.quota : '',
          [
            (control: FormControl) =>
              requireDependValidator(
                control,
                !this.isShareQuotaAllocationControl?.value,
                true
              ),
            (control: FormControl) =>
              this.minRedeemedValidator(
                control,
                value?.quota || 0,
                value?.redeemed_quota
              ),
            Validators.max(20000),
          ],
        ],
        redeemed_quota: [value ? value.redeemed_quota : 0],
      })
    );

    if (!value && this.isShareQuotaAllocationControl?.value) {
      setTimeout(() => {
        this.reValidateChannels();
      }, 0);
    }
  }

  reValidateForm() {
    const codevalues: PromocodeCode[] = this.codesFormArray.getRawValue() || [];
    (this.codesFormArray?.controls || []).forEach((control, index) => {
      control
        .get('code')
        ?.setValidators([
          (control) =>
            requireDependValidator(
              control,
              !this.isShareQuotaAllocationControl?.value
            ),
        ]);

      control
        .get('quota')
        ?.setValidators([
          (control) =>
            requireDependValidator(
              control,
              !this.isShareQuotaAllocationControl?.value,
              true
            ),
          (childControl) =>
            this.minRedeemedValidator(
              childControl,
              codevalues[index]?.quota || 0,
              control.get('redeemed_quota')?.getRawValue()
            ),
          Validators.max(20000),
        ]);

      control
        .get('channel')
        ?.setValidators([
          (childControl) =>
            this.checkSameChannelValidator(
              childControl,
              control.get('tempId')?.getRawValue()
            ),
        ]);
    });

    this.sharedQuotaControl?.setValidators([
      (control) =>
        requireDependValidator(
          control,
          this.isShareQuotaAllocationControl?.value,
          true
        ),
      (control) =>
        this.minRedeemedValidator(
          control,
          this.sharedQuotaControl?.getRawValue() || 0,
          this.sharedRedeemedQuotaControl?.getRawValue()
        ),
      Validators.max(20000),
    ]);

    this.sharedCodeControl?.setValidators([
      (control) =>
        requireDependValidator(
          control,
          this.isShareQuotaAllocationControl?.value,
          true
        ),
    ]);
  }

  transformCode(control: AbstractControl | null | undefined) {
    control?.patchValue((control?.getRawValue() || '').toUpperCase());
    this.reValidateChannels();
  }

  transformSharedCode(control: AbstractControl | null | undefined) {
    control?.patchValue((control?.getRawValue() || '').toUpperCase());
  }

  reValidateChannels() {
    this.codesFormArray.controls.forEach((control) => {
      control.get('channel')?.markAllAsTouched();
      control.get('channel')?.updateValueAndValidity();
    });
  }

  reValidateOtherChannels(rowControl: AbstractControl) {
    this.codesFormArray.controls.forEach((control) => {
      if (control.get('tempId')?.value !== rowControl.get('tempId')?.value) {
        control.get('channel')?.markAllAsTouched();
        control.get('channel')?.updateValueAndValidity();
      }
    });
  }

  checkSameChannelValidator = (
    control: AbstractControl,
    rowId: string
  ): ValidationErrors | null => {
    const channelValue = (control.getRawValue() || '').trim();
    const codesValue: PromocodeCode[] = this.codesFormArray.getRawValue() || [];
    const rowItem = codesValue.find((item) => item.tempId === rowId);
    const codeItem = rowItem ? rowItem.code : '';
    const isShareQuotaAllocation =
      this.isShareQuotaAllocationControl?.getRawValue();
    if (isShareQuotaAllocation) {
      const sameChannelRows = codesValue.filter((item) => {
        return item.channel === channelValue || !channelValue || !item.channel;
      });

      if (sameChannelRows.length > 1) {
        return { sameChannel: true };
      }
    } else {
      const sameChannelRows = codesValue.filter((item) => {
        return (
          item.code === codeItem &&
          (item.channel === channelValue || !item.channel || !channelValue)
        );
      });

      if (sameChannelRows.length > 1) {
        return { sameChannel: true };
      }
    }

    return null;
  };

  minRedeemedValidator = (
    control: AbstractControl,
    maxQuota: number | string,
    redeemed_quota: number | string
  ): ValidationErrors | null => {
    const quotaValue = control.getRawValue();

    if (
      !redeemed_quota ||
      isEmptyValue(quotaValue) ||
      Number(quotaValue || 0) < 0
    ) {
      return null;
    }

    if (!!redeemed_quota && Number(quotaValue || 0) < Number(maxQuota)) {
      return { minRedeemed: maxQuota };
    }

    return null;
  };

  isSharedAllRedeemedCode() {
    const value: PromocodeCode[] = this.codesFormArray.getRawValue() || [];
    return (
      !!this.isShareQuotaAllocationControl?.getRawValue() &&
      value.length > 0 &&
      value.some((item) => !item.channel)
    );
  }
}
