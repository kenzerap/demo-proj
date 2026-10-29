import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { SvgPersonComponent } from 'src/app/shared/icons/svg-person/svg-person.component';
import { SvgVerifiedUserComponent } from '../../../../shared/icons/svg-verified-user/svg-verified-user.component';
import { SvgGroupComponent } from '../../../../shared/icons/svg-group/svg-group.component';
import { SvgFileCloudComponent } from '../../../../shared/icons/svg-file-cloud/svg-file-cloud.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomerPolicy } from '../../models/customer-policy.model';
import { CustomerPoint } from '../../models/customer-point.model';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import { CommonModule } from '@angular/common';
import { PolicyType } from 'src/app/shared/utils/enums/policy-type.enum';
import { SvgStarComponent } from '@app/shared/icons/svg-star/svg-star.component';
import { CustomerTier } from '../../models/cutomer-tier.model';

@Component({
  selector: 'app-analytic-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    SvgPersonComponent,
    MatChipsModule,
    SvgVerifiedUserComponent,
    SvgGroupComponent,
    SvgFileCloudComponent,
    SvgStarComponent,
  ],
  templateUrl: './analytic-summary.component.html',
  styleUrl: './analytic-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticSummaryComponent {
  private store = inject(Store);

  analyticSummary$: Observable<{
    customerPolicy: CustomerPolicy | null;
    customerPoint: CustomerPoint | null;
    customerTier: CustomerTier | null;
  }> = this.store.select(fromAnalyticSummarySelectors.selectAnalyticSummary);

  policyType = PolicyType;
}
