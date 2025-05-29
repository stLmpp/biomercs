import { ChangeDetectionStrategy, Component } from '@angular/core';
import { mdiAccountLock, mdiEmailSyncOutline } from '@mdi/js';
import { HeaderQuery } from '../header/header.query';
import { PageTitleComponent } from '../shared/title/page-title.component';
import { CardMenusDirective } from '../shared/components/card/card-menu/card-menus.directive';
import { CardMenuDirective } from '../shared/components/card/card-menu/card-menu.directive';
import { RouterLink } from '@angular/router';
import { BadgeDirective } from '../shared/components/badge/badge.directive';
import { IconComponent } from '../shared/components/icon/icon.component';
import { IconMdiComponent } from '../shared/components/icon/icon-mdi.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    CardMenusDirective,
    CardMenuDirective,
    RouterLink,
    BadgeDirective,
    IconComponent,
    IconMdiComponent,
    AsyncPipe,
  ],
})
export class AdminComponent {
  constructor(private headerQuery: HeaderQuery) {}

  readonly adminApprovalCount$ = this.headerQuery.adminApprovalCount$;
  readonly mdiEmailSyncOutline = mdiEmailSyncOutline;
  readonly mdiAccountLock = mdiAccountLock;
}
