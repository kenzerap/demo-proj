import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDecimalLimiter]',
  standalone: true,
})
export class DecimalLimiterDirective {
  @Input() decimalPlaces: number = 2;

  constructor(private el: ElementRef) {}

  private invalidInputNumberRegex = /[^0-9.]/;

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initalValue = this.el.nativeElement.value;
    if (isNaN(Number(initalValue))) {
      return;
    }
    const [integerPart, decimalPart] = initalValue.split('.');
    if (decimalPart && decimalPart.length > this.decimalPlaces) {
      this.el.nativeElement.value = Number(
        `${integerPart}.${decimalPart.slice(0, this.decimalPlaces)}`
      );
      event.stopPropagation();
      this.el.nativeElement.dispatchEvent(new Event('input'));
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const initalValue = this.el.nativeElement.value;
    const newValue = `${initalValue}${event.key}`;
    if (this.invalidInputNumberRegex.test(event.key)) {
      return;
    }

    const [_integerPart, decimalPart] = newValue.split('.');
    if (decimalPart && decimalPart.length > this.decimalPlaces) {
      event.preventDefault();
    }
  }
}
