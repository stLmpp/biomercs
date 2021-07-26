import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CardTitleDirective } from './card-title.directive';
import { CardContentDirective } from './card-content.directive';
import { CardActionsDirective } from './card-actions.directive';
import { CardSubtitleDirective } from '@shared/components/card/card-subtitle.directive';
import { Animations } from '@shared/animations/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CardChild } from '@shared/components/card/card-child';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'bio-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card' },
  animations: [Animations.skipFirstAnimation(), Animations.collapse.collapseIcon()],
  exportAs: 'bio-card',
})
export class CardComponent extends Destroyable implements AfterContentInit {
  constructor(private changeDetectorRef: ChangeDetectorRef, public elementRef: ElementRef<HTMLElement>) {
    super();
  }

  private _collapsable = false;
  private _dark = false;

  @ContentChildren(CardTitleDirective) readonly cardTitleDirectives!: QueryList<CardTitleDirective>;
  @ContentChildren(CardSubtitleDirective) readonly cardSubtitleDirective!: QueryList<CardSubtitleDirective>;
  @ContentChildren(CardContentDirective) readonly cardContentDirectives!: QueryList<CardContentDirective>;
  @ContentChildren(CardActionsDirective) readonly cardActionsDirective!: QueryList<CardActionsDirective>;
  @ContentChildren(CardChild) readonly cardChildren!: QueryList<CardChild>;

  @Input()
  @HostBinding('class.collapsable')
  get collapsable(): boolean {
    return this._collapsable;
  }
  set collapsable(collapsable: boolean) {
    this._collapsable = coerceBooleanProperty(collapsable);
  }

  @Input() collapsed = false;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

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
    return !!this.cardTitleDirectives?.length || !!this.cardSubtitleDirective?.length;
  }

  @HostBinding('class.has-actions')
  get hasActionsClass(): boolean {
    return !!this.cardActionsDirective?.length;
  }

  onCollapseToggle(): void {
    if (!this._collapsable) {
      return;
    }
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
    this.changeDetectorRef.markForCheck();
  }

  ngAfterContentInit(): void {
    this.cardChildren.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  static ngAcceptInputType_collapsable: BooleanInput;
  static ngAcceptInputType_dark: BooleanInput;
}
