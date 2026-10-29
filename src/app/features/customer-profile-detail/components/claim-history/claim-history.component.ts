import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DemoprojTableComponent } from 'src/app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from 'src/app/shared/components/demoproj-table/models/table-column.model';
import { claimHistoryColumns } from '../../constants/claim-history-columns.const';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { Claim } from '../../models/claim.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as claimHistorySelectors from '../../stores/claim-history/claim-history.selectors';
import * as claimHistoryActions from '../../stores/claim-history/claim-history.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-claim-history',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent],
  templateUrl: './claim-history.component.html',
  styleUrl: './claim-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimHistoryComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);

  @Input() policy!: Policy;

  tableColumns: WritableSignal<TableColumn[]> = signal(claimHistoryColumns);
  partyId: WritableSignal<string> = signal('');

  claimHistories$: Signal<Observable<Claim[]>> = computed(() => {
    return this.store.select(
      claimHistorySelectors.selectClaimHistoryByPolicyId(this.policy.policy_id)
    );
  });

  pagination$ = computed(() => {
    return this.store
      .select(
        claimHistorySelectors.selectClaimHistoryPaginationByPolicyId(
          this.policy.policy_id
        )
      )
      .pipe(map((pagination) => pagination || this.defaultParams()));
  });
  loading$: Signal<Observable<boolean>> = computed(() => {
    return this.store.select(
      selectIsLoading(`getClaimHistories-${this.policy.policy_id}`)
    );
  });

  defaultParams: WritableSignal<Partial<Pagination>> = signal({
    page: 0,
    size: 5,
  });

  constructor() {
    super();

    this.activatedRoute.parent?.params
      .pipe(
        filter((params) => !!params['party_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.partyId.set(params['party_id']);
      });
  }

  ngOnInit(): void {
    if (this.policy.policy_id) {
      this.store.dispatch(
        claimHistoryActions.getClaimHistories({
          partyId: this.partyId(),
          policyId: this.policy.policy_id,
          queryParams: { ...this.defaultParams() },
        })
      );
    }
  }

  onPageChange(page: number) {
    this.defaultParams.update((params) => ({ ...params, page }));
    this.store.dispatch(
      claimHistoryActions.getClaimHistories({
        partyId: this.partyId(),
        policyId: this.policy.policy_id,
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.defaultParams.update((params) => ({
      ...params,
      size: pageSize,
      page: 0,
    }));
    this.store.dispatch(
      claimHistoryActions.getClaimHistories({
        partyId: this.partyId(),
        policyId: this.policy.policy_id,
        queryParams: { ...this.defaultParams() },
      })
    );
  }
}
