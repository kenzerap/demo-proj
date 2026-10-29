import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CarouselModule } from 'primeng/carousel';
import * as eClaimSubmitSelectors from '../../stores/e-claim-submit/e-claim-submit.selectors';
import * as eClaimSubmitActions from '../../stores/e-claim-submit/e-claim-submit.actions';
import { map, Observable } from 'rxjs';
import { EClaimImageUrls } from '../../models/e-claim-image-urls.model';

@Component({
  selector: 'app-review-images-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CarouselModule, AsyncPipe],
  templateUrl: './review-images-dialog.component.html',
  styleUrl: './review-images-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewImagesDialogComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  data: { partyId: string; policyId: number; imageNames: string[] } =
    inject(MAT_DIALOG_DATA);

  eClaimImageUrls$: Signal<Observable<string[]>> = computed(() => {
    return this.store
      .select(
        eClaimSubmitSelectors.selectEClaimImageUrlsByPolicyId(
          this.data.policyId
        )
      )
      .pipe(
        map((eClaimImageUrls: EClaimImageUrls) =>
          (eClaimImageUrls.presigned_urls || []).map(
            (urls) => urls.presigned_url
          )
        )
      );
  });

  ngOnInit(): void {
    this.store.dispatch(
      eClaimSubmitActions.getEClaimImageUrls({
        partyId: this.data.partyId,
        policyId: this.data.policyId,
        imageNames: this.data.imageNames,
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(eClaimSubmitActions.resetEClaimImageUrls());
  }
}
