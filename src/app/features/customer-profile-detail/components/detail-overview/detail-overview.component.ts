import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { CustomerDetailViewComponent } from '../customer-detail-view/customer-detail-view.component';
import { AnalyticSummaryComponent } from '../analytic-summary/analytic-summary.component';
import { PolicyListComponent } from '../policy-list/policy-list.component';
import { FamilyPolicyListComponent } from '../family-policy-list/family-policy-list.component';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { filter, map, Observable, takeUntil } from 'rxjs';
import * as fromAnalyticSummaryActions from '../../stores/analytic-summary/analytic-summary.actions';
import { CustomerType } from 'src/app/shared/utils/enums/customer-type.enum';
import * as fromAnalyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from 'src/app/shared/components/no-data/no-data.component';
import { ClientInfoSvocComponent } from '../client-info-svoc/client-info-svoc.component';

@Component({
  selector: 'app-detail-overview',
  standalone: true,
  imports: [
    CommonModule,
    CustomerDetailViewComponent,
    AnalyticSummaryComponent,
    PolicyListComponent,
    FamilyPolicyListComponent,
    NoDataComponent,
    ClientInfoSvocComponent,
  ],
  templateUrl: './detail-overview.component.html',
  styleUrl: './detail-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailOverviewComponent
  extends BaseComponent
  implements OnDestroy
{
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  customerTypeCode = CustomerType;
  noDataMessage = {
    imgUrl: 'telescope.svg',
    title: `User don't have any policy.`,
    subTitle: `If there is, it is likely in the approval process, which will appear here when the process is complete`,
  };
  partyId: WritableSignal<string> = signal('');

  customerType$: Observable<CustomerType | null> = this.store
    .select(fromAnalyticSummarySelectors.selectCustomerPolicy)
    .pipe(map((customerPolicy) => customerPolicy?.customer_type || null));

  constructor() {
    super();

    this.activatedRoute.parent?.params
      .pipe(
        filter((params) => !!params['party_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        const partyId = params['party_id'];
        this.partyId.set(partyId);

        this.store.dispatch(
          fromAnalyticSummaryActions.getAnalyticSummary({ partyId })
        );
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(fromAnalyticSummaryActions.reset());
  }
}
