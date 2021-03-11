import { ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { AbstractComponent } from '../core/abstract-component';

@Component({
  selector: 'icon:not([flag]):not([mdi])',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'material-icons icon' },
  encapsulation: ViewEncapsulation.None,
})
export class IconComponent extends AbstractComponent {}

@Component({
  selector: 'icon[mdi]:not([flag])',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mdi icon' },
  encapsulation: ViewEncapsulation.None,
})
export class IconMdiComponent extends AbstractComponent {
  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
    super();
  }

  @Input()
  get mdi(): string {
    return `mdi-${this._mdi}`;
  }
  set mdi(mdi: string) {
    if (this._mdi) {
      this.renderer2.removeClass(this.elementRef.nativeElement, this.mdi);
    }
    this._mdi = mdi;
    this.renderer2.addClass(this.elementRef.nativeElement, this.mdi);
  }
  private _mdi!: string;
}
