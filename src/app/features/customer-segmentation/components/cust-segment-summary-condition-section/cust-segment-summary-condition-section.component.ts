import { MatIconModule } from '@angular/material/icon';
import { FormGroup } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { CarouselModule } from 'primeng/carousel';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as CustomerSegmentationActions from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.actions';
import * as CustomerSegmentationSelectors from '@app/features/customer-segmentation/stores/create-edit-customer-segmentation/create-edit-customer-segmentation.selectors';
import { SvgDefaultUserComponent } from '../../../../shared/icons/svg-default-user/svg-default-user.component';
import { SvgDefectiveThinCircleComponent } from '../../../../shared/icons/svg-defective-thin-circle/svg-defective-thin-circle.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SegmentSummaryUser } from '@app/shared/models/segment-summary-user.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-cust-segment-summary-condition-section',
  standalone: true,
  imports: [
    MatIconModule,
    CarouselModule,
    SvgDefaultUserComponent,
    SvgDefectiveThinCircleComponent,
    MatProgressSpinnerModule,
    MatDividerModule,
    AsyncPipe,
    DecimalPipe,
  ],
  templateUrl: './cust-segment-summary-condition-section.component.html',
  styleUrl: './cust-segment-summary-condition-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustSegmentSummaryConditionSectionComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);

  @Input() formGroup!: FormGroup;
  @Input() segmentGroupForm!: FormGroup;
  @Input() isCreateMode: boolean = false;
  @Input() formMode: 'create' | 'edit' | 'view' = 'create';

  _targetGroupId!: number;
  @Input() set targetGroupId(value: number) {
    this._targetGroupId = value;
    this.segmentSummaryUsers$ = this.store.select(
      CustomerSegmentationSelectors.selectSegmentSummaryUserById(value)
    );
  }
  get targetGroupId() {
    return this._targetGroupId;
  }

  segmentSummaryUsers$: Observable<SegmentSummaryUser | undefined> =
    this.store.select(
      CustomerSegmentationSelectors.selectSegmentSummaryUserById(
        this.targetGroupId
      )
    );

  ngOnInit(): void {
    this.store.dispatch(CustomerSegmentationActions.getSegmentSummaryUsers());
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
