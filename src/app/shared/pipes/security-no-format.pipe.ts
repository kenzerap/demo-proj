import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'securityNoFormat',
  standalone: true,
})
export class SecurityNoFormatPipe implements PipeTransform {
  transform(value: string): string {
    const isNumber = /^\d+$/.test(value);
    if (!value || value.length !== 13 || !isNumber) {
      return value;
    }

    // Format the number into X-XXXX-XXXXX-XX-X
    return `${value[0]}-${value.slice(1, 5)}-${value.slice(5, 10)}-${value.slice(10, 12)}-${value[12]}`;
  }
}
