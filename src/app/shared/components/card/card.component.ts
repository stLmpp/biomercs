import { ChangeDetectionStrategy, Component, ContentChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { CardTitleDirective } from './card-title.directive';
import { CardContentDirective } from './card-content.directive';
import { CardActionsDirective } from './card-actions.directive';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card' },
})
export class CardComponent {
  @ContentChildren(CardTitleDirective) cardTitleDirectives!: QueryList<CardTitleDirective>;
  @ContentChildren(CardContentDirective) cardContentDirectives!: QueryList<CardContentDirective>;
  @ContentChildren(CardActionsDirective) cardActionsDirective!: QueryList<CardActionsDirective>;
}
