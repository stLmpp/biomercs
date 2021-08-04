import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { AbstractComponent } from '@shared/components/core/abstract-component';
import { RegionService } from '../../../../region/region.service';

@Component({
  selector: 'icon[flag]',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flag-icon icon' },
  encapsulation: ViewEncapsulation.None,
})
export class FlagComponent extends AbstractComponent {
  constructor(private elementRef: ElementRef, private renderer2: Renderer2, private regionService: RegionService) {
    super();
  }

  private _squared = false;
  private _flag = '';

  @Input()
  get flag(): string | undefined {
    return this._flag;
  }
  set flag(flag: string | undefined) {
    if (this._flag) {
      this.renderer2.removeClass(this.elementRef.nativeElement, 'flag-icon-' + this._flag);
    }
    if (flag) {
      this._flag = flag.toLowerCase();
      this.renderer2.addClass(this.elementRef.nativeElement, 'flag-icon-' + this._flag);
      this.renderer2.setStyle(
        this.elementRef.nativeElement,
        'background-image',
        `url('${this.regionService.getFlagSvgUrl(this._flag)}')`
      );
      this.regionService.getFlagSvg(this._flag).subscribe(console.log);
    }
  }

  @Input()
  @HostBinding('class.flag-icon-squared')
  get squared(): boolean {
    return this._squared;
  }
  set squared(squared: boolean) {
    this._squared = coerceBooleanProperty(squared);
  }

  static ngAcceptInputType_squared: BooleanInput;
}
