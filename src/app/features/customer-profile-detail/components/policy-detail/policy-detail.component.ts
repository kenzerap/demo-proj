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
import { DemoprojTableComponent } from '../../../../shared/components/demoproj-table/demoproj-table.component';
import { Policy, PolicyDetail } from '../../models/policy.model';
import { PolicyTypeCode } from 'src/app/shared/utils/enums/policy-type.enum';
import {
  policyDetailDefaultColumns,
  policyDetailGroupColumns,
} from '../../constants/policy-detail-columns.const';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromPolicyDetailSelectors from '../../stores/policy-detail/policy-detail.selectors';
import * as fromPolicyDetailActions from '../../stores/policy-detail/policy-detail.actions';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { TableColumn } from 'src/app/shared/components/demoproj-table/models/table-column.model';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent],
  templateUrl: './policy-detail.component.html',
  styleUrl: './policy-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyDetailComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);

  @Input() policy!: Policy;

  partyId: WritableSignal<string> = signal<string>('');

  policyTypeCode = PolicyTypeCode;
  tableColumns: Signal<TableColumn[]> = computed(() => {
    if (this.policy.system_id === PolicyTypeCode.GROUP) {
      return policyDetailGroupColumns;
    } else {
      return policyDetailDefaultColumns;
    }
  });

  policyDetail$: Signal<Observable<PolicyDetail[]>> = computed(() => {
    return this.store
      .select(
        fromPolicyDetailSelectors.selectPolicyDetailByPolicyId(
          this.policy.policy_id
        )
      )
      .pipe(map((policyDetail) => (policyDetail ? [policyDetail] : [])));
  });

  loading$: Signal<Observable<boolean>> = computed(() => {
    return this.store.select(
      selectIsLoading(`getPolicyDetail-${this.policy.policy_id}`)
    );
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
    if (this.policy?.policy_id) {
      this.store.dispatch(
        fromPolicyDetailActions.getPolicyDetail({
          partyId: this.partyId(),
          policyId: this.policy.policy_id,
        })
      );
    }
  }
}
