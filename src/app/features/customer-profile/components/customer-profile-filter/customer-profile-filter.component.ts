import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import * as customerProfileFilterActions from '../../stores/customer-profile-filter/customer-profile-filter.actions';
import * as customerProfileFilterSelectors from '../../stores/customer-profile-filter/customer-profile-filter.selectors';
import { combineLatest, takeUntil } from 'rxjs';
import { BaseComponent } from '@app/shared/components/base/base.component';

@Component({
  selector: 'app-customer-profile-filter',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './customer-profile-filter.component.html',
  styleUrl: './customer-profile-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerProfileFilterComponent
  extends BaseComponent
  implements OnInit
{
  private fb = inject(FormBuilder);
  private store = inject(Store);

  searchForm: FormGroup = this.fb.group({
    commonSearch: [''],
    policyNumber: [''],
    certificateNumber: [''],
  });

  commonSearch = this.store.select(
    customerProfileFilterSelectors.selectCommonSearch,
  );

  policyNumber = this.store.select(
    customerProfileFilterSelectors.selectPolicyNumber,
  );

  certificateNumber = this.store.select(
    customerProfileFilterSelectors.selectCertificateNumber,
  );

  ngOnInit(): void {
    combineLatest([
      this.commonSearch,
      this.policyNumber,
      this.certificateNumber,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([commonSearch, policyNumber, certificateNumber]) => {
        this.searchForm.patchValue(
          {
            commonSearch,
            policyNumber,
            certificateNumber,
          },
          { emitEvent: false },
        );
      });
  }

  onSearch() {
    const formValues = this.searchForm.value;
    this.store.dispatch(
      customerProfileFilterActions.searchCustomerProfiles({
        commonSearch: formValues.commonSearch,
        policyNumber: formValues.policyNumber,
        certificateNumber: formValues.certificateNumber,
      }),
    );
  }

  resetForm() {
    this.searchForm.reset();
    this.onSearch();
  }

  trimSpaces(controlName: string) {
    const value = this.searchForm.get(controlName)?.value || '';
    this.searchForm
      .get(controlName)
      ?.setValue(value.trim(), { emitEvent: false });
  }
}
