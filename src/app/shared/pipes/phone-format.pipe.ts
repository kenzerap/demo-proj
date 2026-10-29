import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    const isNumber = /^\d+$/.test(value);
    if (!value || value.length !== 10 || !isNumber) {
      return value; // Return original value if it's invalid
    }

    // Format the number to +66-xxx-xxx-xxxx
    return `+66-${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
  }
}
