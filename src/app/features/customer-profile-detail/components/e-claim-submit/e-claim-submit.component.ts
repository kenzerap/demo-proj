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
import { eClaimSubmitColumns } from '../../constants/e-claim-submit-columns.const';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { EClaim } from '../../models/e-claim.model';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as eClaimSubmitSelectors from '../../stores/e-claim-submit/e-claim-submit.selectors';
import * as eClaimSubmitActions from '../../stores/e-claim-submit/e-claim-submit.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { Policy } from '../../models/policy.model';
import { MatTableModule } from '@angular/material/table';
import { SvgFileDownloadComponent } from '../../../../shared/icons/svg-file-download/svg-file-download.component';
import { MatButtonModule } from '@angular/material/button';
import { SvgBtnDownloadComponent } from '../../../../shared/icons/svg-btn-download/svg-btn-download.component';
import { MatDialog } from '@angular/material/dialog';
import { ReviewImagesDialogComponent } from '../review-images-dialog/review-images-dialog.component';

@Component({
  selector: 'app-e-claim-submit',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatTableModule,
    SvgFileDownloadComponent,
    MatButtonModule,
    SvgBtnDownloadComponent,
  ],
  templateUrl: './e-claim-submit.component.html',
  styleUrl: './e-claim-submit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EClaimSubmitComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  @Input() policy!: Policy;

  tableColumns: WritableSignal<TableColumn[]> = signal(eClaimSubmitColumns);
  partyId: WritableSignal<string> = signal('');

  eClaimSubmits$: Signal<Observable<EClaim[]>> = computed(() => {
    return this.store.select(
      eClaimSubmitSelectors.selectEClaimSubmitByPolicyId(this.policy.policy_id)
    );
  });

  pagination$ = computed(() => {
    return this.store
      .select(
        eClaimSubmitSelectors.selectEClaimSubmitPaginationByPolicyId(
          this.policy.policy_id
        )
      )
      .pipe(map((pagination) => pagination || this.defaultParams()));
  });

  loading$: Signal<Observable<boolean>> = computed(() => {
    return this.store.select(
      selectIsLoading(`getEClaimSubmits-${this.policy.policy_id}`)
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
        eClaimSubmitActions.getEClaimSubmits({
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
      eClaimSubmitActions.getEClaimSubmits({
        partyId: this.partyId(),
        policyId: this.policy.policy_id,
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.defaultParams.update((params) => ({ ...params, size: pageSize, page: 0 }));
    this.store.dispatch(
      eClaimSubmitActions.getEClaimSubmits({
        partyId: this.partyId(),
        policyId: this.policy.policy_id,
        queryParams: { ...this.defaultParams() },
      })
    );
  }

  openReviewImagesDialog(data: EClaim, columnCode: any) {
    let imageNames: string[] = [];

    switch (columnCode) {
      case 'receiptImages':
        imageNames = [...data.receiptImages];
        break;
      case 'medicalCertificates':
        imageNames = [...data.medicalCertificates];
        break;
      case 'otherDocuments':
        imageNames = [...data.otherDocuments];
        break;
    }

    this.dialog.open(ReviewImagesDialogComponent, {
      data: {
        imageNames,
        partyId: this.partyId(),
        policyId: this.policy.policy_id,
      },
      width: '30rem',
      height: '44rem',
      autoFocus: false,
    });
  }

  checkDisabled(data: EClaim, columnCode: string): boolean {
    switch (columnCode) {
      case 'receiptImages':
        return data.receiptImages.length === 0;
      case 'medicalCertificates':
        return data.medicalCertificates.length === 0;
      case 'otherDocuments':
        return data.otherDocuments.length === 0;
      default:
        return false;
    }
  }

  downloadZipFile(data: EClaim, columnCode: string) {
    const imageUrls = [
      ...data.receiptImages,
      ...data.medicalCertificates,
      ...data.otherDocuments,
    ];
    const eclaimId = data.eclaimId;
    this.store.dispatch(
      eClaimSubmitActions.downloadImagesZip({
        eclaimId,
        imageUrls,
        policyId: this.policy.policy_id,
        partyId: this.partyId(),
      })
    );
  }
}
