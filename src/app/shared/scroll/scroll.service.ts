import { ElementRef, Injectable, inject } from '@angular/core';
import { WINDOW } from '../../core/window.service';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private window = inject<Window>(WINDOW);


  scrollIntoViewOffset(element: HTMLElement | ElementRef, offset: number): void {
    if (!element) {
      return;
    }
    if (element instanceof ElementRef) {
      element = element.nativeElement as HTMLElement;
    }
    const y = element.getBoundingClientRect().top + this.window.pageYOffset + offset;
    this.window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
