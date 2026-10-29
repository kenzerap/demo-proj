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
import { clientInfoSvocColumns } from '../../constants/client-info-svoc-columns.const';
import { filter, map, Observable, of, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as analyticSummarySelectors from '../../stores/analytic-summary/analytic-summary.selectors';
// import * as claimHistoryActions from '../../stores/client-info-svoc/client-info-svoc.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { Policy } from '../../models/policy.model';
import { MatDividerModule } from '@angular/material/divider';
import { CustomerClient } from '../../models/customer-client.model';

@Component({
  selector: 'app-client-info-svoc',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent, MatDividerModule],
  templateUrl: './client-info-svoc.component.html',
  styleUrl: './client-info-svoc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientInfoSvocComponent {
  private store = inject(Store);

  @Input() partyId = '';

  tableColumns: WritableSignal<TableColumn[]> = signal(clientInfoSvocColumns);

  clientsInfoSvoc$: Observable<CustomerClient[]> = this.store.select(
    analyticSummarySelectors.selectClientsInfoSvoc
  );

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading(`getAnalyticSummary`)
  );
}
