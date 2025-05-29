import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, QueryList, Renderer2, TemplateRef, ViewEncapsulation, inject, input, viewChild, contentChildren } from '@angular/core';
import { Animations } from '@shared/animations/animations';
import { OverlayRef } from '@angular/cdk/overlay';
import { AnimationEvent } from '@angular/animations';
import { AutocompleteOptionDirective } from '@shared/components/autocomplete/autocomplete-option.directive';
import { FocusKeyManager, CdkTrapFocus } from '@angular/cdk/a11y';
import { Autocomplete } from '@shared/components/autocomplete/autocomplete';
import { Control } from '@stlmpp/control';
import { noop } from 'st-utils';
import { Key } from '@model/enum/key';
import { Observable, of, pluck, startWith, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.inOut(100), Animations.scale.in(100, 0.8)],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: Autocomplete, useExisting: AutocompleteComponent }],
  imports: [CdkTrapFocus, AsyncPipe],
})
export class AutocompleteComponent extends Autocomplete implements AfterContentInit {
  private renderer2 = inject(Renderer2);
  changeDetectorRef = inject(ChangeDetectorRef);


  readonly templateRef = viewChild.required(TemplateRef);
  readonly autocompleteOptions = contentChildren(AutocompleteOptionDirective, { descendants: true });

  readonly closeOnSelect = input(true);
  readonly replaceInputWithValue = input(true);

  overlayRef?: OverlayRef;
  focusManager?: FocusKeyManager<AutocompleteOptionDirective>;
  control?: Control<string>;
  origin?: HTMLInputElement;
  setFocusOnOrigin = noop;
  onSelect$ = new Subject<void>();

  optionsCount$ = of(0);

  onFadeDone($event: AnimationEvent): void {
    if (this.overlayRef && $event.toState === 'void') {
      this.overlayRef?.dispose();
    }
  }

  init(): void {
    this.focusManager = new FocusKeyManager(this.autocompleteOptions())
      .withVerticalOrientation()
      .skipPredicate(element => element.disabled);
  }

  setFocusOnFirstOption(): void {
    this.focusManager?.setFirstItemActive();
  }

  onKeydown($event: KeyboardEvent): void {
    if (this.focusManager) {
      const itemFocused = this.focusManager.activeItemIndex;
      if (itemFocused === 0 && $event.key === Key.ArrowUp) {
        this.setFocusOnOrigin();
      } else {
        this.focusManager.onKeydown($event);
      }
    }
  }

  isSelected(value: string): boolean {
    return this.control ? this.control.value === value : this.origin?.value === value;
  }

  select(value: string): void {
    if (this.replaceInputWithValue()) {
      if (this.control) {
        this.control.setValue(value);
      } else if (this.origin) {
        this.renderer2.setProperty(this.origin, 'value', value);
      }
    }
    this.onSelect$.next();
    if (this.closeOnSelect()) {
      this.onSelect$.complete();
      this.overlayRef?.detach();
    }
  }

  ngAfterContentInit(): void {
    const optionsChanges: Observable<QueryList<AutocompleteOptionDirective>> = this.autocompleteOptions().changes.pipe(
      startWith(this.autocompleteOptions())
    );
    this.optionsCount$ = optionsChanges.pipe(pluck('length'));
  }
}
