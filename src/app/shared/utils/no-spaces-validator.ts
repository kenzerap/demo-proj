import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

export const noSpacesValidatorAsync = (
  control: AbstractControl
): Observable<ValidationErrors | null> => {
  const value = control.value || '';
  if (value.trim() === '') {
    return of({ required: true });
  }
  return of(null);
};

export const noSpacesValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value || '';
  if (value.trim() === '') {
    return { required: true };
  }
  return null;
};
