import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewEncapsulation,
  inject,
  input,
  output,
  contentChildren,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CardTitleDirective } from './card-title.directive';
import { CardContentDirective } from './card-content.directive';
import { CardActionsDirective } from './card-actions.directive';
import { CardSubtitleDirective } from '@shared/components/card/card-subtitle.directive';
import { Animations } from '@shared/animations/animations';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { CardChild } from '@shared/components/card/card-child';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { takeUntil } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { CollapseComponent } from '../collapse/collapse.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'bio-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card' },
  animations: [Animations.skipFirstAnimation(), Animations.collapse.collapseIcon()],
  exportAs: 'bio-card',
  imports: [IconComponent, CollapseComponent, NgTemplateOutlet],
})
export class CardComponent extends Destroyable implements AfterContentInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private _collapsable = false;
  private _dark = false;

  readonly cardTitleDirectives = contentChildren(CardTitleDirective);
  readonly cardSubtitleDirective = contentChildren(CardSubtitleDirective);
  readonly cardContentDirectives = contentChildren(CardContentDirective);
  readonly cardActionsDirective = contentChildren(CardActionsDirective);
  readonly cardChildren = contentChildren(CardChild);

  @Input()
  @HostBinding('class.collapsable')
  get collapsable(): boolean {
    return this._collapsable;
  }
  set collapsable(collapsable: boolean) {
    this._collapsable = coerceBooleanProperty(collapsable);
  }

  readonly collapsed = input(false);
  readonly collapsedChange = output<boolean>();

  @Input()
  @HostBinding('class.dark')
  set dark(dark: boolean) {
    this._dark = coerceBooleanProperty(dark);
  }
  get dark(): boolean {
    return this._dark;
  }

  @HostBinding('class.has-header')
  get hasHeaderClass(): boolean {
    return !!this.cardTitleDirectives()?.length || !!this.cardSubtitleDirective()?.length;
  }

  @HostBinding('class.has-actions')
  get hasActionsClass(): boolean {
    return !!this.cardActionsDirective()?.length;
  }

  onCollapseToggle(): void {
    if (!this._collapsable) {
      return;
    }
    this.collapsed = !this.collapsed();
    this.collapsedChange.emit(this.collapsed());
    this.changeDetectorRef.markForCheck();
  }

  ngAfterContentInit(): void {
    toObservable(this.cardChildren)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
  }

  static ngAcceptInputType_collapsable: BooleanInput;
  static ngAcceptInputType_dark: BooleanInput;
}
