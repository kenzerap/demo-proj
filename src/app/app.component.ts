import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SnackbarService } from './shared/services/snackbar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterModule, CommonModule],
})
export class AppComponent {
  snackbarService = inject(SnackbarService);
}
