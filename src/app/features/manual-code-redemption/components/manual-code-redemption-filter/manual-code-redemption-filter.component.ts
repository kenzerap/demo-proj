import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import * as ManualCodeRedemptionsActions from '../../stores/manual-code-redemption/manual-code-redemption.actions';
import * as manualCodeRedemptionSelector from '../../stores/manual-code-redemption/manual-code-redemption.selector';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DemoprojInputComponent } from '@app/shared/components/demoproj-input/demoproj-input.component';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { CommonModule } from '@angular/common';
import { ManualCodeRedemptionQueryParams } from '../../models/manual-code-redemption-query-params.model';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { SvgExportComponent } from '@app/shared/icons/svg-export/svg-export.component';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';
import { Observable } from 'rxjs';
import { ManualCodeRedemption } from '../../models/manual-code-redemption.model';

@Component({
  selector: 'app-manual-code-redemption-filter',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    DemoprojInputComponent,
    CommonModule,
    MatSelectModule,
    HasPermissionsDirective,
    SvgExportComponent,
  ],
  templateUrl: './manual-code-redemption-filter.component.html',
  styleUrl: './manual-code-redemption-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualCodeRedemptionFilterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  listLoading$ = this.store.select(selectIsLoading('getManualCodeRedemption'));
  exportLoading$ = this.store.select(
    selectIsLoading(`exportManualCodeRedemption`)
  );
  manualCodeRedemption$: Observable<ManualCodeRedemption[]> = this.store.select(
    manualCodeRedemptionSelector.selectfromManualCodeRedemption
  );

  searchForm: FormGroup = this.fb.group({
    search_text: [''],
  });
  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  hasFilter(filters: Partial<ManualCodeRedemptionQueryParams>): boolean {
    if (!filters) return false;
    return !!(filters.search_text && filters.search_text.trim());
  }

  onSearch() {
    const formValues = this.searchForm.value;
    if (!this.hasFilter(formValues)) {
      return;
    }

    this.store.dispatch(
      ManualCodeRedemptionsActions.setManualCodeRedemptionFilters({
        filters: {
          search_text: (formValues.search_text || '').trim(),
          page: 0,
          size: 20,
        },
      })
    );
  }

  resetForm() {
    this.searchForm.reset();
    this.store.dispatch(
      ManualCodeRedemptionsActions.resetManualCodeRedemptionFilters()
    );
  }

  exportToExcel() {
    this.store.dispatch(
      ManualCodeRedemptionsActions.exportManualCodeRedemption({
        expected_zone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
  }
}
