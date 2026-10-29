import { CommonModule } from '@angular/common';
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
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import * as pointHistoryActions from '../../stores/point-history/point-history.actions';
import { selectIsLoading } from 'src/app/store/loading/loading.selectors';
import { SvgDeleteComponent } from '../../../../shared/icons/svg-delete/svg-delete.component';
import { filter, take } from 'rxjs';
import { noSpacesValidatorAsync } from '@app/shared/utils/no-spaces-validator';
import { DemoprojInputComponent } from "../../../../shared/components/demoproj-input/demoproj-input.component";

@Component({
  selector: 'app-delete-point',
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
    MatDividerModule,
    SvgDeleteComponent,
    DemoprojInputComponent
],
  templateUrl: './delete-point.component.html',
  styleUrl: './delete-point.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletePointComponent {
  private store = inject(Store);
  data: { partyId: string } = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<DeletePointComponent>);
  fb = inject(FormBuilder);
  loading$ = this.store.select(selectIsLoading(`deletePoint`));
  isSubmitted = false;

  currentDate = new Date();
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
    remark: ['', Validators.required, noSpacesValidatorAsync],
  });

  get pointControl() {
    return this.addPointForm.get('point');
  }

  get remarkControl() {
    return this.addPointForm.get('remark');
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
    this.store.dispatch(
      pointHistoryActions.deletePoint({
        partyId: this.data.partyId,
        queryParams: this.addPointForm.value,
      })
    );
  }

  trimSpaces(controlName: string) {
    const value = this.addPointForm.get(controlName)?.value || '';
    this.addPointForm
      .get(controlName)
      ?.setValue(value.trim(), { emitEvent: false });
  }
}
