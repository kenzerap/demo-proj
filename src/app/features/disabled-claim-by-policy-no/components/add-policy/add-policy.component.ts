import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import * as DisabledClaimByPolicyNoActions from '../../stores/disabled-claim-by-policy-no-list/disabled-claim-by-policy-no-list.actions';
import { DemoprojInputComponent } from '@app/shared/components/demoproj-input/demoproj-input.component';
import { SvgPlusComponent } from '@app/shared/icons/svg-plus/svg-plus.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { selectIsLoading } from '@app/store/loading/loading.selectors';

@Component({
  selector: 'app-add-policy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    DemoprojInputComponent,
    SvgPlusComponent,
  ],
  templateUrl: './add-policy.component.html',
  styleUrl: './add-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPolicyComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('addPolicyToDisabledClaim'),
  );

  addPolicyForm: FormGroup = this.fb.group({
    policyNo: [''],
  });

  onAdd() {
    const policyNo = (this.addPolicyForm.value.policyNo || '').trim();

    this.store.dispatch(
      DisabledClaimByPolicyNoActions.addPolicyToDisabledClaim({
        policy_no: policyNo,
      }),
    );
  }
}
