import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PolicyTypeCode } from 'src/app/shared/utils/enums/policy-type.enum';
import { Policy } from '../../models/policy.model';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import { SvgGroupBgRedComponent } from 'src/app/shared/icons/svg-group-bg-red/svg-group-bg-red.component';
import { LoadingDirective } from 'src/app/shared/directives/loading.directive';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { NoDataComponent } from 'src/app/shared/components/no-data/no-data.component';
import { ClaimHistoryComponent } from '../claim-history/claim-history.component';
import { EClaimSubmitComponent } from "../e-claim-submit/e-claim-submit.component";

@Component({
  selector: 'app-family-policy-list',
  standalone: true,
  imports: [
    CommonModule,
    SvgGroupBgRedComponent,
    MatListModule,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule,
    LoadingDirective,
    NoDataComponent,
    ClaimHistoryComponent,
    EClaimSubmitComponent
],
  templateUrl: './family-policy-list.component.html',
  styleUrl: './family-policy-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyPolicyListComponent {
  private store = inject(Store);
  policyTypeCode = PolicyTypeCode;
  noDataMessage = {
    imgUrl: 'telescope.svg',
    title: `User don't have any dependent's policy.`,
    subTitle: `User dependent's policy will appear here.`,
  };
  expansionStatus: WritableSignal<{ [key: string]: boolean }> = signal({});

  familyPolicies$: Observable<Policy[]> = this.store.select(
    fromAnalyticSummarySelectors.selectFamilyPolicies
  );

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getAnalyticSummary')
  );

  setExpansionStatus(policyId: number, status: boolean): void {
    this.expansionStatus.update((prev) => {
      return {
        ...prev,
        [policyId]: status,
      };
    });
  }
}
