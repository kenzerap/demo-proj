import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SvgFileCloudBgRedComponent } from '@shared/icons/svg-file-cloud-bg-red/svg-file-cloud-bg-red.component';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import * as eClaimSubmitActions from '../../stores/e-claim-submit/e-claim-submit.actions';
import * as claimHistoryActions from '../../stores/claim-history/claim-history.actions';
import { Policy } from '../../models/policy.model';
import { PolicyTypeCode } from '@shared/utils/enums/policy-type.enum';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { PolicyDetailComponent } from '../policy-detail/policy-detail.component';
import * as fromPolicyDetailActions from '../../stores/policy-detail/policy-detail.actions';
import { ClaimHistoryComponent } from '../claim-history/claim-history.component';
import { EClaimSubmitComponent } from '../e-claim-submit/e-claim-submit.component';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [
    CommonModule,
    SvgFileCloudBgRedComponent,
    MatListModule,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule,
    LoadingDirective,
    PolicyDetailComponent,
    ClaimHistoryComponent,
    EClaimSubmitComponent,
  ],
  templateUrl: './policy-list.component.html',
  styleUrl: './policy-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyListComponent implements OnDestroy {
  private store = inject(Store);
  policyTypeCode = PolicyTypeCode;
  expansionStatus: WritableSignal<{ [key: string]: boolean }> = signal({});

  ownerPolicies$: Observable<Policy[]> = this.store.select(
    fromAnalyticSummarySelectors.selectOwnerPolicies
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

  ngOnDestroy(): void {
    this.store.dispatch(fromPolicyDetailActions.reset());
    this.store.dispatch(claimHistoryActions.reset());
    this.store.dispatch(eClaimSubmitActions.reset());
  }
}
