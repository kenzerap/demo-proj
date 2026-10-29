import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appHighlightText]',
  standalone: true,
})
export class HighlightTextDirective implements OnChanges {
  @Input('appHighlightText') textHighlighted: string = '';
  @Input('ignoreDash') ignoreDash: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textHighlighted']) {
      setTimeout(() => {
        this.highlightText();
      }, 100);
    }
  }

  private highlightText(): void {
    const element = this.el.nativeElement;
    const text = element.textContent;
    const textHighlighted = this.textHighlighted?.trim();

    // Reset the inner HTML to remove previous highlights
    this.renderer.setProperty(element, 'innerHTML', text);

    if (textHighlighted && text) {
      const formattedText = this.ignoreDash
        ? this.searchIgnoreDash(text, textHighlighted)
        : textHighlighted;

      if (!formattedText) {
        return;
      }

      const regex = new RegExp(`(${this.escapeRegExp(formattedText)})`, 'gi');
      const highlightedText = text.replace(
        regex,
        `<span style="background-color: yellow;">$1</span>`
      );
      this.renderer.setProperty(element, 'innerHTML', highlightedText);
    }
  }

  private escapeRegExp(text: string): string {
    // Escape special characters for regex
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  searchIgnoreDash(input: string, searchKey: string): string | null {
    const inputWithoutDash = input.replace(/-/g, '');
    const startIndex = inputWithoutDash.indexOf(searchKey);

    if (startIndex === -1) {
      return null;
    }

    let result = '';
    let currentIndex = 0;

    for (const char of input) {
      const isInMatchRange =
        currentIndex >= startIndex &&
        currentIndex < startIndex + searchKey.length;

      if (char === '-' && isInMatchRange) {
        result += '-';
      }

      if (char !== '-') {
        if (isInMatchRange) {
          result += char;
        }
        currentIndex++;
      }
    }

    // trim dashes
    return result.replace(/^-+|-+$/g, '');
  }
}
