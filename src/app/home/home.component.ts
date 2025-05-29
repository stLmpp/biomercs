import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { HeaderQuery } from '../header/header.query';
import { filterNil } from '@util/operators/filter';
import { map, pluck } from 'rxjs';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { CardMenusDirective } from '../shared/components/card/card-menu/card-menus.directive';
import { CardMenuDirective } from '../shared/components/card/card-menu/card-menu.directive';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/components/icon/icon.component';
import { BadgeDirective } from '../shared/components/badge/badge.directive';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardMenusDirective, CardMenuDirective, RouterLink, IconComponent, BadgeDirective, AsyncPipe],
})
export class HomeComponent {
  private authQuery = inject(AuthQuery);
  private headerQuery = inject(HeaderQuery);
  private breakpointObserverService = inject(BreakpointObserverService);


  readonly isLogged$ = this.authQuery.isLogged$;
  readonly isAdmin$ = this.authQuery.isAdmin$;
  readonly adminApprovalCount$ = this.headerQuery.adminApprovalCount$;
  readonly playerRequestChangesCount$ = this.headerQuery.playerRequestChangesCount$;
  readonly idPlayer$ = this.authQuery.user$.pipe(filterNil(), pluck('idPlayer'), filterNil());
  readonly isNotMobile$ = this.breakpointObserverService.isMobile$.pipe(map(isMobile => !isMobile));
}
