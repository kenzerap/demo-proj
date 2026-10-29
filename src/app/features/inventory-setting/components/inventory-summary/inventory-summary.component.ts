import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'primeng/carousel';
import { map, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as CreateEditInventorySelectors from '../../stores/create-edit-inventory/create-edit-inventory.selectors';
import { BaseComponent } from '@app/shared/components/base/base.component';
import { SvgDefectiveThinCircleComponent } from '../../../../shared/icons/svg-defective-thin-circle/svg-defective-thin-circle.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventorySummary } from '../../models/inventory-summary.model';
import { CommonModule } from '@angular/common';
import { SvgTicketComponent } from '../../../../shared/icons/svg-ticket/svg-ticket.component';

@Component({
  selector: 'app-inventory-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CarouselModule,
    SvgDefectiveThinCircleComponent,
    MatProgressSpinnerModule,
    SvgTicketComponent,
  ],
  templateUrl: './inventory-summary.component.html',
  styleUrl: './inventory-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorySummaryComponent extends BaseComponent {
  private store = inject(Store);

  inventorySummary$: Observable<InventorySummary | null> = this.store.select(
    CreateEditInventorySelectors.selectInventorySummary
  );
}
