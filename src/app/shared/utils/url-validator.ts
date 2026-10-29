import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

const URL_REGEX =
  /^(?:(https?|ftp|sftp):\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|((\d{1,3}\.){3}\d{1,3}))(:(\d+))?(\/[^\s?#]*)?(\?[^\s#]*)?(#[^\s]*)?$/i;

export const urlValidatorAsync = (
  control: AbstractControl
): Observable<ValidationErrors | null> => {
  const value = control.value || '';
  if (!value.trim()) {
    return of(null);
  }

  return URL_REGEX.test(value) ? of(null) : of({ invalidUrl: true });
};

export const urlValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value || '';
  if (!value.trim()) {
    return null;
  }
  return URL_REGEX.test(value) ? null : { invalidUrl: true };
};
