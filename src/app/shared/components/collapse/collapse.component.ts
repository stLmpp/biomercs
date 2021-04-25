import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CollapseTitleDirective } from './collapse-title.directive';
import { Animations } from '../../animations/animations';

// TODO REFACTOR THIS TO BE ACCORDION

@Component({
  selector: 'bio-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.collapse.collapse(), Animations.collapse.collapseIcon()],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'collapse' },
})
export class CollapseComponent extends CdkAccordionItem {
  @Input() collapseTitle?: string;

  @ContentChildren(CollapseTitleDirective) collapseTitleDirectives!: QueryList<CollapseTitleDirective>;

  @HostBinding('class.expanded') get expandedClass(): boolean {
    return this.expanded;
  }
  @HostBinding('class.disabled') get disabledClass(): boolean {
    return this.disabled;
  }
}
