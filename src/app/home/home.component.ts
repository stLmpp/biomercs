import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { HeaderQuery } from '../header/header.query';
import { filterNil } from '@shared/operators/filter';
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

  isLogged$ = this.authQuery.isLogged$;
  isAdmin$ = this.authQuery.isAdmin$;
  adminApprovalCount$ = this.headerQuery.adminApprovalCount$;
  playerApprovalCount$ = this.headerQuery.playerApprovalCount$;
  playerRequestChangesCount$ = this.headerQuery.playerRequestChangesCount$;

  idUser$ = this.authQuery.user$.pipe(filterNil(), pluck('id'));
  isNotMobile$ = this.breakpointObserverService.isMobile$.pipe(map(isMobile => !isMobile));
}
