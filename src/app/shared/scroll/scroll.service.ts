import { ElementRef, Inject, Injectable } from '@angular/core';
import { WINDOW } from '../../core/window.service';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  constructor(@Inject(WINDOW) private window: Window) {}

  scrollIntoViewOffset(element: HTMLElement | ElementRef, offset: number): void {
    if (!element) {
      return;
    }
    if (element instanceof ElementRef) {
      element = element.nativeElement as HTMLElement;
    }
    const y = element.getBoundingClientRect().top + this.window.scrollY + offset;
    this.window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
