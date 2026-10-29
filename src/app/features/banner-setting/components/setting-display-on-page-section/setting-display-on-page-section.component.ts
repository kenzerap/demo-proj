import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValueCode } from '@app/shared/models/value-code.model';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { combineLatest, filter, map, Observable, of, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import * as BannerSettingActions from '../../stores/banner-setting/banner-setting.actions';
import * as popupAnnouncementSelectors from '../../stores/banner-setting/banner-setting.selectors';
import { BannerSettingTab } from '../../models/banner-setting-tabs.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setting-display-on-page-section',
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
  templateUrl: './setting-display-on-page-section.component.html',
  styleUrl: './setting-display-on-page-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingDisplayOnPageSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);

  @Input() formGroup!: FormGroup;
  @Input() isCreateMode!: boolean;

  pageOptions: ValueCode[] = [];

  popupAnnouncementTabs$: Observable<BannerSettingTab[]> = this.store.select(
    popupAnnouncementSelectors.selectBannerSettingTabs
  );

  get pageIdControl() {
    return this.formGroup?.get('pageId');
  }

  ngOnInit(): void {
    this.store.dispatch(
      BannerSettingActions.getBannerSettingTabs({
        isDropdownOptions: false,
      })
    );

    combineLatest([
      this.activatedRoute.queryParams,
      this.popupAnnouncementTabs$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ([_params, popupAnnouncementTabs]) => popupAnnouncementTabs && popupAnnouncementTabs.length > 0
        )
      )
      .subscribe(([params, popupAnnouncementTabs]) => {
        const convertedOptions = popupAnnouncementTabs.map(
          (popupAnnouncementTab) => ({
            value: popupAnnouncementTab.page_name,
            code: popupAnnouncementTab.page_id.toString(),
          })
        );

        this.pageOptions = convertedOptions;

        if (this.isCreateMode) {
          this.pageIdControl?.patchValue(
            params['pageId'] ? params['pageId'] : this.pageOptions[0]?.code,
            {
              emitEvent: false,
            }
          );
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
