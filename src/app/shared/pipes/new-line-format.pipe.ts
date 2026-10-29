import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'newLineFormat', standalone: true })
export class NewLineFormat implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/\n/g, '<br>') : '';
  }
}
