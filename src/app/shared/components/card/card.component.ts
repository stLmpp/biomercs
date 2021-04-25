import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CardTitleDirective } from './card-title.directive';
import { CardContentDirective } from './card-content.directive';
import { CardActionsDirective } from './card-actions.directive';
import { CardSubtitleDirective } from '@shared/components/card/card-subtitle.directive';
import { Animations } from '@shared/animations/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

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
export class CardComponent {
  constructor(private changeDetectorRef: ChangeDetectorRef, public elementRef: ElementRef<HTMLElement>) {}

  private _collapsable = false;

  @ContentChildren(CardTitleDirective) cardTitleDirectives!: QueryList<CardTitleDirective>;
  @ContentChildren(CardSubtitleDirective) cardSubtitleDirective!: QueryList<CardSubtitleDirective>;
  @ContentChildren(CardContentDirective) cardContentDirectives!: QueryList<CardContentDirective>;
  @ContentChildren(CardActionsDirective) cardActionsDirective!: QueryList<CardActionsDirective>;

  @Input()
  @HostBinding('class.collapsable')
  get collapsable(): boolean {
    return this._collapsable;
  }
  set collapsable(collapsable: boolean) {
    this._collapsable = coerceBooleanProperty(collapsable);
  }

  @Input() collapsed = false;

  @HostBinding('class.has-header')
  get hasHeaderClass(): boolean {
    return !!this.cardTitleDirectives?.length || !!this.cardSubtitleDirective?.length;
  }
  onCollapseToggle(): void {
    if (!this._collapsable) {
      return;
    }
    this.collapsed = !this.collapsed;
    this.changeDetectorRef.markForCheck();
  }

  static ngAcceptInputType_collapsable: BooleanInput;
}
