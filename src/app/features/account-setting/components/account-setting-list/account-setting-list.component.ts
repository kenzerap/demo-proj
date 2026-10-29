import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as accountSettingsSelectors from '../../stores/account-setting/account-setting.selectors';
import * as AccountSettingsActions from '../../stores/account-setting/account-setting.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { Pagination } from 'src/app/shared/models/paged-data.model';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { SvgPlusComponent } from '../../../../shared/icons/svg-plus/svg-plus.component';
import { MatButtonModule } from '@angular/material/button';
import { UserAccount } from '../../models/user-account.model';
import { GetUsersQueryParams } from '../../models/get-users-query-params.model';
import { AccountSettingListColumns } from '../../constants/account-setting-list-columns.const';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserAccountComponent } from '../create-user-account/create-user-account.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions-directive';
import { FeaturePermissionCode } from '@app/shared/utils/enums/feature-permission-code.enum';
import { ActionPermissionCode } from '@app/shared/utils/enums/action-permission-code.enum';

@Component({
  selector: 'app-account-setting-list',
  standalone: true,
  imports: [
    CommonModule,
    DemoprojTableComponent,
    MatSlideToggleModule,
    SvgPlusComponent,
    MatButtonModule,
    HasPermissionsDirective,
  ],
  templateUrl: './account-setting-list.component.html',
  styleUrl: './account-setting-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingListComponent
  extends BaseComponent
  implements OnDestroy
{
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  tableColumns: WritableSignal<TableColumn[]> = signal(
    AccountSettingListColumns
  );
  partyId: WritableSignal<string> = signal('');

  featurePermissionCode = FeaturePermissionCode;
  actionPermissionCode = ActionPermissionCode;

  accountSettings$: Observable<UserAccount[]> = this.store.select(
    accountSettingsSelectors.selectAccountSettings
  );

  pagination$: Observable<Pagination> = this.store.select(
    accountSettingsSelectors.selectPagination
  );
  loading$: Observable<boolean> = this.store.select(
    selectIsLoading('getAccountSettings')
  );

  defaultParams: WritableSignal<Partial<GetUsersQueryParams>> = signal({
    page: 0,
    size: 20,
  });

  ngOnInit(): void {
    this.store.dispatch(
      AccountSettingsActions.setAccountSettingFilters({
        filters: this.defaultParams(),
      })
    );
  }

  onPageChange(page: number) {
    this.store.dispatch(
      AccountSettingsActions.setAccountSettingFilters({
        filters: { page },
      })
    );
  }

  onPageSizeChange(pageSize: number) {
    this.store.dispatch(
      AccountSettingsActions.setAccountSettingFilters({
        filters: { size: pageSize, page: 0 },
      })
    );
  }

  createAccountSetting() {
    this.dialog.open(CreateUserAccountComponent, {
      data: {},
      autoFocus: false,
      width: '35rem',
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(AccountSettingsActions.resetAll());
  }
}
