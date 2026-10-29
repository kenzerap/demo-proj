import { DecimalPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prefixNumber',
  standalone: true,
})
export class PrefixNumberPipe implements PipeTransform {
  decimalPipe = inject(DecimalPipe);

  transform(
    value: number | null | undefined,
    format: string = '1.0-2',
    locale: string = 'en-US'
  ): string {
    if (value === null || value === undefined) {
      return '';
    }
    const prefix = Math.abs(value) === 0 ? '' : value > 0 ? '+' : '-';
    return `${prefix}${this.decimalPipe.transform(
      Math.abs(value),
      format,
      locale
    )}`;
  }
}
