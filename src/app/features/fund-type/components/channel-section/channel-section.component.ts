import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, take, takeUntil } from 'rxjs';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { ValueCode } from '@app/shared/models/value-code.model';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import * as CreateEditFundTypeSelectors from '../../stores/create-edit-fund-type/create-edit-fund-type.selectors';
import { FundType } from '../../models/fund-type.model';

@Component({
  selector: 'app-channel-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSlideToggleModule,
    SvgPlusComponent,
  ],
  templateUrl: './channel-section.component.html',
  styleUrl: './channel-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelSectionComponent extends BaseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private changeDetection = inject(ChangeDetectorRef);

  @Input() formGroup!: FormGroup;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  channelOptions: WritableSignal<ValueCode<number>[]> = signal([]);
  channelOptions$: Observable<ValueCode<number>[]> = this.store
    .select(CreateEditFundTypeSelectors.selectChannelOptions)
    .pipe(
      map((channels) =>
        channels.map((channel) => ({
          value: channel.name_en,
          code: channel.channel_id,
        })),
      ),
    );

  fundTypeDetail$: Observable<FundType | null> = this.store.select(
    CreateEditFundTypeSelectors.selectFundTypeDetail,
  );

  get channelsFormArray(): FormArray {
    return this.formGroup.get('channels') as FormArray;
  }

  ngOnInit(): void {
    this.channelOptions$
      .pipe(
        filter((options) => options?.length > 0),
        take(1),
      )
      .subscribe((options) => {
        this.channelOptions.set(options);
      });

    combineLatest([this.fundTypeDetail$, this.channelOptions$])
      .pipe(
        filter(
          ([fundTypeDetail, channelOptions]) => channelOptions?.length > 0,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(([fundTypeDetail, channelOptions]) => {
        if (this.formMode !== 'create' && fundTypeDetail) {
          this.channelsFormArray.clear();
          (fundTypeDetail.channels || []).forEach((channel) => {
            this.addChannel({
              channel: channel.channel_id,
              visible: !!channel.visible,
            });
          });
        }

        if (this.formMode === 'create') {
          const channelsFormValue = this.channelsFormArray.getRawValue();
          const newFormValue = (channelsFormValue || []).map((item) => ({
            ...item,
            channel: channelOptions[0]?.code || '',
          }));

          this.channelsFormArray.patchValue(newFormValue, {
            emitEvent: false,
          });
        }

        if (this.formMode === 'view') {
          this.formGroup.disable();
        }

        this.changeDetection.detectChanges();
        this.formGroup.markAsUntouched();
      });
  }

  getDropdownValue(
    selectedCode: number | null,
    dropdownOptions: ValueCode<number>[],
  ): string {
    return (
      dropdownOptions.find((item) => item.code === selectedCode)?.value || ''
    );
  }

  disableItemDropdown(code: number): boolean {
    const channels = (this.channelsFormArray.getRawValue() || []).map(
      (item) => item.channel,
    );
    return channels.includes(code);
  }

  addChannel(value: { channel: number; visible: boolean } | null = null) {
    const channels = (this.channelsFormArray.getRawValue() || []).map(
      (item) => item.channel,
    );

    const availableOptions = this.channelOptions().filter(
      (option) => !channels.includes(option.code),
    );

    this.channelsFormArray.push(
      this.fb.group({
        channel: [
          value ? value.channel : availableOptions[0]?.code || '',
          Validators.required,
        ],
        visible: [value ? value.visible : false],
      }),
    );
  }

  isAllChannelsSelected(): boolean {
    return (
      this.channelOptions().length === this.channelsFormArray.controls.length
    );
  }

  removeChannel(index: number) {
    this.channelsFormArray.removeAt(index);
  }
}
