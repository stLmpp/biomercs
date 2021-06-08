import { ChangeDetectionStrategy, Component } from '@angular/core';
import { mdiAccountLock, mdiEmailSyncOutline } from '@mdi/js';

@Component({
  selector: 'bio-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  readonly mdiEmailSyncOutline = mdiEmailSyncOutline;
  readonly mdiAccountLock = mdiAccountLock;
}
