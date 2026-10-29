import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SvgCalendarComponent } from '../../../../shared/icons/svg-calendar/svg-calendar.component';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import * as pointHistoryActions from '../../stores/point-history/point-history.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { filter, take } from 'rxjs';
import { DemoprojInputComponent } from '@app/shared/components/demoproj-input/demoproj-input.component';

@Component({
  selector: 'app-add-point',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    SvgCalendarComponent,
    MatDividerModule,
    DemoprojInputComponent,
  ],
  providers: [DatePipe],
  templateUrl: './add-point.component.html',
  styleUrl: './add-point.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPointComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  datePipe = inject(DatePipe);
  private dialogRef = inject(MatDialogRef<AddPointComponent>);
  data: { partyId: string } = inject(MAT_DIALOG_DATA);

  loading$ = this.store.select(selectIsLoading(`addPoint`));
  isSubmitted = false;

  minDate = new Date(new Date().setDate(new Date().getDate() + 1));
  addPointForm: FormGroup = this.fb.group({
    point: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.max(1000000),
        Validators.pattern(/^\d+$/),
      ],
    ],
    expiryDate: ['', Validators.required],
    remark: [''],
  });

  get pointControl() {
    return this.addPointForm.get('point');
  }

  get expiryDateControl() {
    return this.addPointForm.get('expiryDate');
  }

  ngOnInit(): void {
    this.loading$
      .pipe(
        filter((loading) => !loading && this.isSubmitted),
        take(1)
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  onSubmit() {
    if (this.addPointForm.invalid) {
      this.addPointForm.markAllAsTouched();
      return;
    }

    this.isSubmitted = true;
    const expiryDate = new Date(this.addPointForm.value.expiryDate);
    expiryDate.setHours(23, 59, 59);

    this.store.dispatch(
      pointHistoryActions.addPoint({
        partyId: this.data.partyId,
        queryParams: {
          ...this.addPointForm.value,
          expiryDate: expiryDate.toISOString(),
        },
      })
    );
  }
}
