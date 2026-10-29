import {
  Directive,
  Input,
  ViewContainerRef,
  ComponentRef,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { LoadingComponent } from '../components/loading/loading.component';

@Directive({
  selector: '[loading]',
  standalone: true,
})
export class LoadingDirective implements OnDestroy {
  private spinnerRef: ComponentRef<LoadingComponent> | null = null;

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  @Input() set loading(isLoading: boolean | null | undefined) {
    if (isLoading) {
      this.showSpinner();
    } else {
      this.hideSpinner();
    }
  }

  private showSpinner() {
    if (!this.spinnerRef) {
      this.spinnerRef = this.viewContainerRef.createComponent(LoadingComponent);
      this.el.nativeElement.style.position = 'relative';
      this.el.nativeElement.appendChild(this.spinnerRef.location.nativeElement);
    }
  }

  private hideSpinner() {
    if (this.spinnerRef) {
      this.spinnerRef.destroy();
      this.spinnerRef = null;
    }
  }

  ngOnDestroy(): void {
    this.hideSpinner();
  }
}
