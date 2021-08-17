import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { HeaderQuery } from '../header/header.query';
import { filterNil } from '@util/operators/filter';
import { map, pluck } from 'rxjs';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';

@Component({
  selector: 'bio-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(
    private authQuery: AuthQuery,
    private headerQuery: HeaderQuery,
    private breakpointObserverService: BreakpointObserverService
  ) {}

  readonly isLogged$ = this.authQuery.isLogged$;
  readonly isAdmin$ = this.authQuery.isAdmin$;
  readonly adminApprovalCount$ = this.headerQuery.adminApprovalCount$;
  readonly playerRequestChangesCount$ = this.headerQuery.playerRequestChangesCount$;
  readonly idPlayer$ = this.authQuery.user$.pipe(filterNil(), pluck('idPlayer'), filterNil());
  readonly isNotMobile$ = this.breakpointObserverService.isMobile$.pipe(map(isMobile => !isMobile));
}
