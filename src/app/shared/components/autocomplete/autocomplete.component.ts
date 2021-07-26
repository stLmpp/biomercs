import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  forwardRef,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Animations } from '@shared/animations/animations';
import { OverlayRef } from '@angular/cdk/overlay';
import { AnimationEvent } from '@angular/animations';
import { AutocompleteOptionComponent } from '@shared/components/autocomplete/autocomplete-option.component';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Autocomplete } from '@shared/components/autocomplete/autocomplete';
import { Control } from '@stlmpp/control';
import { noop } from 'st-utils';
import { Key } from '@model/enum/key';
import { Observable, of, pluck, startWith } from 'rxjs';

@Component({
  selector: 'bio-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.inOut(100), Animations.scale.in(100, 0.8)],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: Autocomplete, useExisting: forwardRef(() => AutocompleteComponent) }],
})
export class AutocompleteComponent extends Autocomplete implements AfterContentInit {
  constructor(private renderer2: Renderer2, public changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  @ViewChild(TemplateRef) readonly templateRef!: TemplateRef<any>;
  @ContentChildren(AutocompleteOptionComponent, { descendants: true })
  readonly autocompleteOptions!: QueryList<AutocompleteOptionComponent>;

  overlayRef?: OverlayRef;
  focusManager?: FocusKeyManager<AutocompleteOptionComponent>;
  control?: Control<string>;
  origin?: HTMLInputElement;
  setFocusOnOrigin = noop;

  optionsCount$ = of(0);

  onFadeDone($event: AnimationEvent): void {
    if (this.overlayRef && $event.toState === 'void') {
      this.overlayRef?.dispose();
    }
  }

  init(): void {
    this.focusManager = new FocusKeyManager(this.autocompleteOptions)
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
    if (this.control) {
      this.control.setValue(value);
    } else if (this.origin) {
      this.renderer2.setProperty(this.origin, 'value', value);
    }
    this.overlayRef?.detach();
  }

  ngAfterContentInit(): void {
    const optionsChanges: Observable<QueryList<AutocompleteOptionComponent>> = this.autocompleteOptions.changes.pipe(
      startWith(this.autocompleteOptions)
    );
    this.optionsCount$ = optionsChanges.pipe(pluck('length'));
  }
}
