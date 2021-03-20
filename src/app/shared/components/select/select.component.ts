import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { Select } from './select';
import { Subject } from 'rxjs';
import { OptionComponent } from './option.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { cdkOverlayTransparentBackdrop } from '@util/overlay';
import { auditTime, startWith, takeUntil } from 'rxjs/operators';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Animations } from '../../animations/animations';
import { AnimationEvent } from '@angular/animations';
import { OptgroupComponent } from './optgroup.component';
import { getOverlayPositionMenu } from '../menu/menu-trigger.directive';
import { isNil } from 'st-utils';
import { Key } from '@model/enum/key';

@Component({
  selector: 'bio-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'bio-select input' },
  providers: [
    { provide: Select, useExisting: forwardRef(() => SelectComponent) },
    { provide: ControlValue, useExisting: forwardRef(() => SelectComponent), multi: true },
  ],
  animations: [Animations.fade.inOut(100), Animations.scale.in(100, 0.8)],
})
// I had to do "implements", instead of "extends", so I can use the "Select" abastract class
export class SelectComponent extends Select implements ControlValue, AfterContentInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef<HTMLElement>
  ) {
    super();
  }

  private _overlayRef?: OverlayRef;
  private _focusManager?: FocusKeyManager<OptionComponent>;

  @ViewChild('panel', { read: TemplateRef }) panelTemplateRef!: TemplateRef<any>;
  @ContentChildren(OptionComponent, { descendants: true }) options!: QueryList<OptionComponent>;
  @ContentChildren(OptgroupComponent, { descendants: true }) optgroups!: QueryList<OptgroupComponent>;

  @Input() compareWith: (valueA: any, valueB: any) => boolean = Object.is;
  @Input() placeholder?: string;

  @HostBinding('attr.title') viewValue = '';

  onChange$ = new Subject<any>();
  onTouched$ = new Subject<void>();
  isOpen = false;
  value: any;

  get primaryClass(): boolean {
    return !this.dangerClass && (this.bioType || 'primary') === 'primary';
  }

  @HostBinding('attr.tabindex')
  get tabindex(): number {
    return this.disabled ? -1 : 0;
  }

  @HostBinding('class.is-open')
  get isOpenClass(): boolean {
    return !this.disabled && this.isOpen;
  }

  private _setViewValueFromOptions(value: any): void {
    const optionSelected = this.options?.find(option => this.compareWith(option.value, value));
    if (optionSelected) {
      this.setViewValue(optionSelected.getViewValue());
    } else {
      this.setViewValue(null);
    }
  }

  @HostListener('click')
  onClick(): void {
    if (this.disabled) {
      return;
    }
    this.isOpen ? this.close() : this.open();
  }

  @HostListener('keydown.space')
  @HostListener('keydown.enter')
  @HostListener('keydown.arrowUp')
  @HostListener('keydown.arrowDown')
  onKeydown(): void {
    this.open();
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched$.next();
  }

  onFadeInOutDone($event: AnimationEvent): void {
    if ($event.toState === 'void') {
      this._overlayRef?.dispose();
    }
  }

  isSelected(value: any): boolean {
    return this.compareWith(this.value, value);
  }

  onPanelKeydown($event: KeyboardEvent): void {
    this._focusManager?.onKeydown($event);
    if ($event.key === Key.Escape) {
      this.close();
    }
  }

  initFocus(): void {
    this._focusManager = new FocusKeyManager(this.options).withVerticalOrientation().withTypeAhead(400);
    if (!isNil(this.value)) {
      const optionSelected = this.options.toArray().findIndex(option => this.compareWith(option.value, this.value));
      this._focusManager.setActiveItem(Math.max(optionSelected, 0));
    } else {
      this._focusManager.setFirstItemActive();
    }
  }

  open(): void {
    this._overlayRef = this.overlay.create({
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: getOverlayPositionMenu(this.overlay, this.elementRef),
      backdropClass: cdkOverlayTransparentBackdrop,
      minWidth: 200,
      minHeight: 32,
      width: this.elementRef.nativeElement.getBoundingClientRect().width,
      hasBackdrop: true,
    });
    const portal = new TemplatePortal(this.panelTemplateRef, this.viewContainerRef);
    this._overlayRef.attach(portal);
    this._overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.close();
      });
    this.initFocus();
    this.isOpen = true;
    this.changeDetectorRef.markForCheck();
  }

  close(): void {
    this.isOpen = false;
    this._overlayRef?.detach();
    this.changeDetectorRef.markForCheck();
  }

  setViewValue(value: any): void {
    this.viewValue = value;
    this.changeDetectorRef.markForCheck();
  }

  setControlValue(value: any): void {
    if (!this.compareWith(value, this.value)) {
      this.onChange$.next(value);
      this.value = value;
    }
    this.close();
  }

  setValue(value: any): void {
    this._setViewValueFromOptions(value);
    this.value = value;
  }

  setDisabled(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stateChanged(): void {}

  ngAfterContentInit(): void {
    this.options.changes.pipe(takeUntil(this.destroy$), auditTime(100), startWith(this.options)).subscribe(() => {
      this._setViewValueFromOptions(this.value);
    });
  }
}
