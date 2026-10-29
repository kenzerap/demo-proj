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
import { filter, Observable, takeUntil } from 'rxjs';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as PointHistorySelectors from '../../stores/point-history/point-history.selectors';
import * as PointHistoryActions from '../../stores/point-history/point-history.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { PointExpire } from '../../models/point-expire-history.model';
import { pointExpireColumns } from '../../constants/point-expire-columns.const';

@Component({
  selector: 'app-point-expire-list',
  standalone: true,
  imports: [CommonModule, DemoprojTableComponent],
  templateUrl: './point-expire-list.component.html',
  styleUrl: './point-expire-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointExpireListComponent
  extends BaseComponent
  implements OnDestroy
{
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  tableColumns: WritableSignal<TableColumn[]> = signal(pointExpireColumns);
  partyId: WritableSignal<string> = signal('');

  pointExpiries$: Observable<PointExpire[]> = this.store.select(
    PointHistorySelectors.selectPointExpiries
  );

  pagination$: Observable<Pagination> = this.store.select(
    PointHistorySelectors.selectPointExpiriesPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getPointExpiries')
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
          PointHistoryActions.getPointExpiries({
            partyId: this.partyId(),
            queryParams: { ...this.defaultParams() },
          })
        );
      });
  }

  onPageChange(page: number) {
    this.defaultParams.update((params) => ({ ...params, page }));
    this.store.dispatch(
      PointHistoryActions.getPointExpiries({
        partyId: this.partyId(),
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
      PointHistoryActions.getPointExpiries({
        partyId: this.partyId(),
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(PointHistoryActions.resetPointExpiries());
  }
}
