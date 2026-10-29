import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

export const timePickerFormatValidatorAsync = (
  control: AbstractControl
): Observable<ValidationErrors | null> => {
  const value: string = control.value;

  if (!value) return of(null); // Ensure input is not empty

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches "HH:mm"
  return timeRegex.test(value) ? of(null) : of({ invalidTimeFormat: true });
};

export const timePickerFormatValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) return null; // Ensure input is not empty

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches "HH:mm"
  return timeRegex.test(value) ? null : { invalidTimeFormat: true };
};
