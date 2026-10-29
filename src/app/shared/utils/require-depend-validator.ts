import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

export const requireDependValidatorAsync = (
  control: AbstractControl,
  dependValue: boolean,
  validateNumberMin: boolean = false
): Observable<ValidationErrors | null> => {
  const value = control.value || '';

  if (validateNumberMin && Number(value) < 0) {
    return of({ min: true });
  }

  if (dependValue) {
    if (typeof value === 'string') {
      return !value.trim() ? of({ required: true }) : of(null);
    }

    return !value ? of({ required: true }) : of(null);
  }

  return of(null);
};

export const requireDependValidator = (
  control: AbstractControl,
  dependValue: boolean,
  validateNumberMin: boolean = false
): ValidationErrors | null => {
  const value = control.value || '';

  if (validateNumberMin && Number(value) < 0) {
    return { min: true };
  }

  if (dependValue) {
    if (typeof value === 'string') {
      return !value.trim() ? { required: true } : null;
    }

    return !value ? { required: true } : null;
  }

  return null;
};
