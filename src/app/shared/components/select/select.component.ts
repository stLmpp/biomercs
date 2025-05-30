import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  input,
  viewChild,
  contentChildren,
} from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { Select } from './select';
import { auditTime, startWith, Subject, takeUntil } from 'rxjs';
import { OptionComponent } from './option.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { cdkOverlayTransparentBackdrop } from '@util/overlay';
import { FocusKeyManager, CdkTrapFocus } from '@angular/cdk/a11y';
import { Animations } from '../../animations/animations';
import { AnimationEvent } from '@angular/animations';
import { OptgroupComponent } from './optgroup.component';
import { BooleanInput, isNil } from 'st-utils';
import { Key } from '@model/enum/key';
import { getOverlayPositionMenu } from '@shared/components/menu/util';
import { ControlState } from '@stlmpp/control/lib/control/control';
import { FormFieldChild } from '@shared/components/form/form-field-child';
import { IconComponent } from '../icon/icon.component';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bio-select:not([multiple])',
  templateUrl: './select.component.html',
  styleUrls: ['./select.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'bio-select input' },
  providers: [
    { provide: Select, useExisting: SelectComponent },
    { provide: ControlValue, useExisting: SelectComponent, multi: true },
    { provide: FormFieldChild, useExisting: SelectComponent },
  ],
  animations: [Animations.fade.inOut(100), Animations.scale.in(100, 0.8)],
  imports: [IconComponent, CdkTrapFocus],
})
// I had to do "implements", instead of "extends", so I can use the "Select" abstract class
export class SelectComponent extends Select implements ControlValue, AfterContentInit, AfterViewInit {
  protected changeDetectorRef = inject(ChangeDetectorRef);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private _afterViewInit = false;
  private _isInvalid = false;
  private _isTouched = false;
  private _setValueAfterViewInit = false;
  private _overlayRef?: OverlayRef;
  private _focusManager?: FocusKeyManager<OptionComponent>;

  readonly panelTemplateRef = viewChild.required('panel', { read: TemplateRef });
  readonly options = contentChildren(OptionComponent, { descendants: true });
  readonly optgroups = contentChildren(OptgroupComponent, { descendants: true });

  readonly compareWith = input<(valueA: any, valueB: any) => boolean>(Object.is);
  readonly placeholder = input<string>();

  @HostBinding('attr.title') viewValue = '';

  readonly onChange$ = new Subject<any>();
  readonly onTouched$ = new Subject<void>();
  isOpen = false;
  value: any;

  override get primaryClass(): boolean {
    return !this.dangerClass && (this.bioType() || 'primary') === 'primary';
  }

  override get dangerClass(): boolean {
    return super.dangerClass || (this._isTouched && this._isInvalid);
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
    const optionSelected = this.options()?.find(option => this.compareWith()(option.value(), value));
    if (optionSelected) {
      this.setViewValue(optionSelected.getViewValue());
    } else {
      this.setViewValue(null);
    }
  }

  private _initFocus(): void {
    this._focusManager = new FocusKeyManager(this.options()).withVerticalOrientation().withTypeAhead(400);
    if (!isNil(this.value)) {
      const optionSelected = this.options().findIndex(option => this.compareWith()(option.value(), this.value));
      this._focusManager.setActiveItem(Math.max(optionSelected, 0));
    } else {
      this._focusManager.setFirstItemActive();
    }
  }

  @HostListener('click')
  onClick(): void {
    if (this._disabled) {
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

  onFadeInOutDone($event: AnimationEvent): void {
    if ($event.toState === 'void') {
      this._overlayRef?.dispose();
      this.focus();
    }
  }

  isSelected(option: OptionComponent): boolean {
    return this.compareWith()(this.value, option.value());
  }

  onPanelKeydown($event: KeyboardEvent): void {
    this._focusManager?.onKeydown($event);
    if ($event.key === Key.Escape) {
      this.close();
    }
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
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
    const portal = new TemplatePortal(this.panelTemplateRef(), this.viewContainerRef);
    this._overlayRef.attach(portal);
    this._overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.close();
      });
    this._initFocus();
    this.isOpen = true;
    this.changeDetectorRef.markForCheck();
  }

  close(): void {
    this.isOpen = false;
    this._overlayRef?.detach();
    this.onTouched$.next();
    this.changeDetectorRef.markForCheck();
  }

  setViewValue(value: any): void {
    this.viewValue = value;
    this.changeDetectorRef.markForCheck();
  }

  setControlValue(value: any): void {
    if (!this.compareWith()(value, this.value)) {
      this.onChange$.next(value);
      this.value = value;
    }
    this.close();
  }

  setValue(value: any): void {
    this._setViewValueFromOptions(value);
    this.value = value;
    if (!this._afterViewInit) {
      this._setValueAfterViewInit = true;
    }
  }

  setDisabled(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  stateChanged(state: ControlState): void {
    this._isInvalid = state.invalid;
    this._isTouched = state.touched;
    this.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this._afterViewInit = true;
    if (this._setValueAfterViewInit) {
      this._setViewValueFromOptions(this.value);
      this._setValueAfterViewInit = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  ngAfterContentInit(): void {
    toObservable(this.options)
      .pipe(takeUntil(this.destroy$), auditTime(100), startWith(this.options()))
      .subscribe(() => {
        this._setViewValueFromOptions(this.value);
      });
  }

  static ngAcceptInputType_multiple: BooleanInput;
}
