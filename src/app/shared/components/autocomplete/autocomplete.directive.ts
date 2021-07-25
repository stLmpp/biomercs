import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  Optional,
  QueryList,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { cdkOverlayTransparentBackdrop } from '@util/overlay';
import { combineLatest, filter, fromEvent, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { AutocompleteComponent } from '@shared/components/autocomplete/autocomplete.component';
import { getOverlayPositionMenu } from '@shared/components/menu/util';
import { ControlDirective } from '@stlmpp/control';
import { AutocompleteOptionComponent } from '@shared/components/autocomplete/autocomplete-option.component';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: 'input[bioAutocomplete],textarea[bioAutocomplete]',
  host: { autocomplete: 'off' },
  exportAs: 'bio-autocomplete',
})
export class AutocompleteDirective extends Destroyable {
  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef<HTMLInputElement>,
    private viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private document: Document,
    @Optional() @Self() private controlDirective?: ControlDirective
  ) {
    super();
  }

  private _isSubscribed = false;
  private _onFocus$ = new Subject<boolean>();
  private _bioAutocompleteFocusOnFirstItem = false;
  private _bioAutocompleteSelectFirstOptionOnEnter = false;

  @Input() bioAutocomplete!: AutocompleteComponent;
  @Input()
  set bioAutocompleteFocusOnFirstItem(bioAutocompleteFocusOnFirstItem: boolean) {
    this._bioAutocompleteFocusOnFirstItem = coerceBooleanProperty(bioAutocompleteFocusOnFirstItem);
  }
  @Input()
  set bioAutocompleteSelectFirstOptionOnEnter(bioAutocompleteSelectFirstOptionOnEnter: boolean) {
    this._bioAutocompleteSelectFirstOptionOnEnter = coerceBooleanProperty(bioAutocompleteSelectFirstOptionOnEnter);
  }
  @Input() bioAutocompleteActionAfterSelect: 'focusOnOrigin' | 'focusNext' | 'focusout' = 'focusNext';
  @Input() bioAutocompleteNext: { focus(...args: any[]): void } | null = null;

  opened = false;
  hasFocus = false;

  private _actionAfterSelect(): void {
    this._onFocus$.next(false);
    switch (this.bioAutocompleteActionAfterSelect) {
      case 'focusOnOrigin':
        this.elementRef.nativeElement.focus();
        break;
      case 'focusNext': {
        if (this.bioAutocompleteNext) {
          this.bioAutocompleteNext.focus();
        }
        break;
      }
      case 'focusout':
        break;
    }
  }

  private _initSub(): void {
    if (this._isSubscribed || !this.bioAutocomplete) {
      return;
    }
    this._isSubscribed = true;
    const optionsChanges: Observable<QueryList<AutocompleteOptionComponent>> =
      this.bioAutocomplete.autocompleteOptions.changes.pipe(startWith(this.bioAutocomplete.autocompleteOptions));
    combineLatest([this._onFocus$, optionsChanges])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([focused, changes]) => {
        this.hasFocus = focused;
        if (changes.length && focused) {
          this._createOverlay();
          if (this._bioAutocompleteFocusOnFirstItem) {
            this.bioAutocomplete.setFocusOnFirstOption();
          }
        } else {
          this.bioAutocomplete.overlayRef?.detach();
        }
      });
  }

  private _createOverlay(): void {
    if (this.opened) {
      Promise.resolve().then(() => this.bioAutocomplete.changeDetectorRef.markForCheck());
      return;
    }
    const overlayRef = this.overlay.create({
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: getOverlayPositionMenu(this.overlay, this.elementRef),
      backdropClass: cdkOverlayTransparentBackdrop,
      minWidth: 250,
      width: this.elementRef.nativeElement.getBoundingClientRect().width,
    });
    overlayRef
      .detachments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.opened = false;
        this._actionAfterSelect();
      });
    this.bioAutocomplete.overlayRef = overlayRef;
    this.bioAutocomplete.origin = this.elementRef.nativeElement;
    this.bioAutocomplete.control = this.controlDirective?.control;
    this.bioAutocomplete.setFocusOnOrigin = () => this.elementRef.nativeElement.focus();
    const templatePortal = new TemplatePortal(this.bioAutocomplete.templateRef, this.viewContainerRef);
    overlayRef.attach(templatePortal);
    fromEvent<MouseEvent>(this.document, 'click')
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(overlayRef.detachments()),
        filter(
          event =>
            !overlayRef.overlayElement.contains(event.target as HTMLElement) &&
            event.target !== this.elementRef.nativeElement
        )
      )
      .subscribe(() => {
        overlayRef.detach();
      });
    this.bioAutocomplete.init();
    this.opened = true;
  }

  @HostListener('keydown.arrowdown')
  onKeydownArrowdown(): void {
    if (this.opened && this.bioAutocomplete) {
      this.bioAutocomplete.setFocusOnFirstOption();
    }
  }

  @HostListener('keydown.tab')
  onKeydownTab(): void {
    if (this.opened) {
      this._onFocus$.next(false);
    }
  }

  @HostListener('keydown.enter')
  onKeydownEnter(): void {
    if (
      this.opened &&
      this._bioAutocompleteSelectFirstOptionOnEnter &&
      this.bioAutocomplete.autocompleteOptions.length
    ) {
      this.bioAutocomplete.autocompleteOptions.find(option => !option.disabled)?.onSelect();
    }
  }

  @HostListener('focus')
  onFocus(): void {
    this._initSub();
    this._onFocus$.next(true);
  }

  static ngAcceptInputType_bioAutocompleteFocusOnFirstItem: BooleanInput;
  static ngAcceptInputType_bioAutocompleteSelectFirstOptionOnEnter: BooleanInput;
}
