import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { TableColumn } from '@app/shared/components/demoproj-table/models/table-column.model';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DemoprojTableComponent } from '@app/shared/components/demoproj-table/demoproj-table.component';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { Sort } from '@angular/material/sort';

import { Store } from '@ngrx/store';
import { privilegeColumns } from './privilege-list-columns.const';
import { Privilege } from '@app/shared/models/privilege.model';
import * as CreateEditUnicodeSelectors from '@app/features/unicode-setting/stores/create-edit-unicode/create-edit-unicode.selectors';
import * as CreateEditUnicodeActions from '@app/features/unicode-setting/stores/create-edit-unicode/create-edit-unicode.actions';
import { PrivilegeDialogFilterComponent } from '../privilege-dialog-filter/privilege-dialog-filter.component';
import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';
import { HighlightTextDirective } from '@app/shared/directives/highlight-text.directive';

@Component({
  selector: 'app-add-privilege-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    MatTabsModule,
    DemoprojTableComponent,
    MatButtonToggleModule,
    PrivilegeDialogFilterComponent,
    HighlightTextDirective,
  ],
  templateUrl: './add-privilege-dialog.component.html',
  styleUrl: './add-privilege-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPrivilegeDialogComponent
  extends BaseComponent
  implements OnInit
{
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<AddPrivilegeDialogComponent>);
  data: {
    privilege: Privilege;
  } = inject(MAT_DIALOG_DATA);

  codeUploadedTableColumns: WritableSignal<TableColumn[]> =
    signal(privilegeColumns);
  selectedItem: WritableSignal<Privilege | null> = signal(null);

  privileges: Privilege[] = [];
  privileges$: Observable<Privilege[]> = this.store.select(
    CreateEditUnicodeSelectors.selectPrivileges
  );
  filteredPrivileges$: Observable<Privilege[]> = this.store.select(
    CreateEditUnicodeSelectors.selectFilteredPrivileges
  );
  selectCommonSearch$: Observable<string> = this.store
    .select(CreateEditUnicodeSelectors.selectPrivilegeSearchFilters)
    .pipe(map((filters) => filters.keyword || ''));

  defaultParams: WritableSignal<Partial<CommonListQueryParams>> = signal({
    keyword: '',
  });

  ngOnInit(): void {
    this.store.dispatch(
      CreateEditUnicodeActions.setPrivilegeSearchFilter({
        filters: this.defaultParams(),
      })
    );

    this.privileges$
      .pipe(
        filter((privileges) => privileges.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe((privileges) => {
        if (this.data.privilege) {
          const activePrivilege = privileges.find(
            (item) => item.privilegeId === this.data.privilege.privilegeId
          );
          this.selectedItem.set(activePrivilege || null);
        }
      });

    this.filteredPrivileges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((privileges) => {
        this.privileges = privileges;
      });
  }

  onSortChange(sort: Sort) {
    this.store.dispatch(
      CreateEditUnicodeActions.setPrivilegeSearchFilter({
        filters: {
          sort_by: sort.direction ? sort.active : undefined,
          sort_direction: sort.direction,
        },
      })
    );
  }

  onSubmit() {
    if (!!this.selectedItem()) {
      this.dialogRef.close({
        selectedItem: this.selectedItem(),
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSelectedItemsChange(event: {
    items: (Privilege | null)[];
    toggleItem: Privilege | null;
  }) {
    this.selectedItem.set(event.toggleItem);
  }
}
