import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { DemoprojTableComponent } from 'src/app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from 'src/app/shared/components/demoproj-table/models/table-column.model';
import { pointHistoryColumns } from '../../constants/point-history-columns.const';
import { filter, Observable, takeUntil } from 'rxjs';
import { PointHistory } from '../../models/point-history.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as pointHistorySelectors from '../../stores/point-history/point-history.selectors';
import * as PointHistoryActions from '../../stores/point-history/point-history.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-point-history-list',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent],
  templateUrl: './point-history-list.component.html',
  styleUrl: './point-history-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointHistoryListComponent
  extends BaseComponent
  implements OnDestroy
{
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  tableColumns: WritableSignal<TableColumn[]> = signal(pointHistoryColumns);
  partyId: WritableSignal<string> = signal('');

  pointHistories$: Observable<PointHistory[]> = this.store.select(
    pointHistorySelectors.selectPointHistories
  );

  pagination$: Observable<Pagination> = this.store.select(
    pointHistorySelectors.selectPointHistoriesPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getPointHistories')
  );

  defaultParams: WritableSignal<Partial<Pagination>> = signal({
    page: 0,
    size: 10,
  });

  constructor() {
    super();

    this.activatedRoute.parent?.parent?.params
      .pipe(
        filter((params) => !!params['party_id']),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        this.partyId.set(params['party_id']);

        this.store.dispatch(
          PointHistoryActions.getPointHistories({
            partyId: this.partyId(),
            queryParams: { ...this.defaultParams() },
          })
        );
      });
  }

  onPageChange(page: number) {
    this.defaultParams.update((params) => ({ ...params, page }));
    this.store.dispatch(
      PointHistoryActions.getPointHistories({
        partyId: this.partyId(),
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.defaultParams.update((params) => ({ ...params, size: pageSize, page: 0 }));
    this.store.dispatch(
      PointHistoryActions.getPointHistories({
        partyId: this.partyId(),
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(PointHistoryActions.resetPointHistories());
  }
}
