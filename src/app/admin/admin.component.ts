import { ChangeDetectionStrategy, Component } from '@angular/core';
import { mdiAccountLock, mdiEmailSyncOutline } from '@mdi/js';
import { HeaderQuery } from '../header/header.query';

@Component({
  selector: 'bio-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  constructor(private headerQuery: HeaderQuery) {}

  adminApprovalCount$ = this.headerQuery.adminApprovalCount$;

  readonly mdiEmailSyncOutline = mdiEmailSyncOutline;
  readonly mdiAccountLock = mdiAccountLock;
}
