import { ChangeDetectionStrategy, Component, HostListener, Input, Output, EventEmitter, inject } from '@angular/core';
import { Animations } from '@shared/animations/animations';
import { User } from '@model/user';
import { HeaderQuery } from '../header.query';
import { mdiAccountLock, mdiEmailSyncOutline, mdiTrophy } from '@mdi/js';
import { ListDirective, ListSelectable } from '../../shared/components/list/list.directive';
import { ListItemComponent } from '../../shared/components/list/list-item.component';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PrefixDirective } from '../../shared/components/common/prefix.directive';
import { IconMdiComponent } from '../../shared/components/icon/icon-mdi.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SuffixDirective } from '../../shared/components/common/suffix.directive';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.slide.inOut({ axis: 'X', opacity: false })],
  host: { '[@slideInOut]': '' },
  imports: [
    ListDirective,
    ListSelectable,
    ListItemComponent,
    RouterLink,
    IconComponent,
    PrefixDirective,
    IconMdiComponent,
    BadgeComponent,
    SuffixDirective,
    AsyncPipe,
  ],
})
export class SideMenuComponent {
  headerQuery = inject(HeaderQuery);


  @Input() user!: User;
  @Input() isMobile = false;

  @Output() readonly menuSelected = new EventEmitter<MouseEvent>();

  readonly mdiTrophy = mdiTrophy;
  readonly mdiEmailSyncOutline = mdiEmailSyncOutline;
  readonly mdiAccountLock = mdiAccountLock;

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  onMenuSelected($event: MouseEvent): void {
    this.menuSelected.emit($event);
  }
}
