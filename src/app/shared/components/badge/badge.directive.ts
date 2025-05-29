import { AfterViewInit, Directive, ElementRef, HostBinding, Input, Optional, Renderer2 } from '@angular/core';
import { BooleanInput, coerceBooleanProperty, isNil } from 'st-utils';
import { BadgeBase, BioBadgeConfig } from '@shared/components/badge/badge';
import { VerticalHorizontalPosition } from '@shared/components/common/positions';

@Directive({
    selector: '[bioBadge]',
    host: {
        class: 'badge-container',
        '[style.position]': `'relative'`,
    },
    standalone: false
})
export class BadgeDirective extends BadgeBase implements AfterViewInit {
  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    @Optional() bioBadgeConfig: BioBadgeConfig
  ) {
    super(bioBadgeConfig);
  }

  private _bioBadge = '';
  private _bioBadgeTop = true;
  private _bioBadgeBottom = false;
  private _bioBadgeRight = true;
  private _bioBadgeLeft = false;
  private _bioBadgeElement?: HTMLSpanElement;
  private _bioBadgeHidden = false;
  private _viewInitialized = false;

  @Input()
  get bioBadge(): any {
    return this._bioBadge;
  }
  set bioBadge(bioBadge: any) {
    this._bioBadge = isNil(bioBadge) ? '' : bioBadge.toString?.() ?? `${bioBadge}`;
    this._buildBadge();
  }

  @HostBinding('class.badge-container-hidden')
  get classBadgeContainerHidden(): boolean {
    return this._bioBadgeHidden || !this._bioBadge;
  }

  @Input()
  get bioBadgeHidden(): boolean {
    return this._bioBadgeHidden;
  }
  set bioBadgeHidden(bioBadgeHidden: boolean) {
    this._bioBadgeHidden = coerceBooleanProperty(bioBadgeHidden);
    this._buildBadge();
  }

  @Input() bioBadgePosition: VerticalHorizontalPosition = 'top right';

  @HostBinding('class.badge-container-top')
  @Input()
  get bioBadgeTop(): boolean {
    return this._bioBadgeTop;
  }
  set bioBadgeTop(bioBadgeTop: boolean) {
    this._bioBadgeTop = coerceBooleanProperty(bioBadgeTop);
    this._setPosition();
  }

  @HostBinding('class.badge-container-bottom')
  @Input()
  get bioBadgeBottom(): boolean {
    return this._bioBadgeBottom;
  }
  set bioBadgeBottom(bioBadgeBottom: boolean) {
    this._bioBadgeBottom = coerceBooleanProperty(bioBadgeBottom);
    this._setPosition();
  }

  @HostBinding('class.badge-container-right')
  @Input()
  get bioBadgeRight(): boolean {
    return this._bioBadgeRight;
  }
  set bioBadgeRight(bioBadgeRight: boolean) {
    this._bioBadgeRight = coerceBooleanProperty(bioBadgeRight);
    this._setPosition();
  }

  @HostBinding('class.badge-container-left')
  @Input()
  get bioBadgeLeft(): boolean {
    return this._bioBadgeLeft;
  }
  set bioBadgeLeft(bioBadgeLeft: boolean) {
    this._bioBadgeLeft = coerceBooleanProperty(bioBadgeLeft);
    this._setPosition();
  }

  @HostBinding('class.badge-container-overlap')
  @Input()
  bioBadgeOverlap = true;

  private _setPosition(): void {
    let position = '';
    if (this._bioBadgeTop) {
      position += 'top ';
    }
    if (this._bioBadgeBottom && !position.includes('top')) {
      position += 'bottom ';
    }
    if (this._bioBadgeLeft) {
      position += 'left';
    }
    if (this._bioBadgeRight && !position.includes('left')) {
      position += 'right';
    }
    this.bioBadgePosition = position as VerticalHorizontalPosition;
    this._buildBadge();
  }

  private _buildBadge(): void {
    if (this._viewInitialized) {
      if (this._bioBadgeElement) {
        this._updateBadge();
      } else {
        this._createBadge();
      }
    }
  }

  private _createBadge(): void {
    const element: HTMLSpanElement = this.renderer2.createElement('span');
    this.renderer2.addClass(element, 'badge');
    element.textContent = this._bioBadge;
    this._bioBadgeElement = element;
    this.renderer2.appendChild(this.elementRef.nativeElement, element);
  }

  private _updateBadge(): void {
    if (this._bioBadgeElement) {
      this._bioBadgeElement.textContent = this._bioBadge;
    }
  }

  ngAfterViewInit(): void {
    this._viewInitialized = true;
    this._buildBadge();
  }

  static ngAcceptInputType_bioBadgeTop: BooleanInput;
  static ngAcceptInputType_bioBadgeBottom: BooleanInput;
  static ngAcceptInputType_bioBadgeRight: BooleanInput;
  static ngAcceptInputType_bioBadgeLeft: BooleanInput;
  static ngAcceptInputType_bioBadgeHidden: BooleanInput;
}
