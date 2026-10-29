import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '@app/store/loading/loading.selectors';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserAccountReportTotals } from '../../models/user-account-report-report.model';
import * as userAccountReportListsSelector from '../../stores/user-account-report-list/user-account-report-list.selector';
import { MatCardModule } from '@angular/material/card';
import { Svg3DBgRedComponent } from '@app/shared/icons/svg-3D-bg-red/svg-3D-bg-red.component';
import { SvgVerifiedUserComponent } from '@app/shared/icons/svg-verified-user/svg-verified-user.component';
import { SvgUserComponent } from '@app/shared/icons/svg-user/svg-user.component';
import { SvgShieldCrossComponent } from "@app/shared/icons/svg-shield-cross/svg-shield-cross.component";

@Component({
  selector: 'app-user-account-report-totals',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatCardModule,
    Svg3DBgRedComponent,
    SvgVerifiedUserComponent,
    SvgUserComponent,
    SvgShieldCrossComponent
],
  templateUrl: './user-account-report-totals.component.html',
  styleUrl: './user-account-report-totals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccountReportTotalsComponent {
  private store = inject(Store);

  userAccountReportTotals$: Observable<UserAccountReportTotals | null> =
    this.store.select(
      userAccountReportListsSelector.selectUserAccountReportsTotals
    );

  listLoading$ = this.store.select(
    selectIsLoading('getUserAccountReportTotals')
  );
}
