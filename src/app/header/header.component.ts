import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { AuthService } from '../auth/auth.service';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import {
  combineLatest,
  debounceTime,
  filter,
  forkJoin,
  map,
  mapTo,
  startWith,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { Router } from '@angular/router';
import { ScoreService } from '../score/score.service';
import { LocalState } from '@stlmpp/store';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { mdiTriangle } from '@mdi/js';
import { filterNil } from '@shared/operators/filter';

export interface HeaderComponentState {
  sideMenuOpened: boolean;
}

@Component({
  selector: 'bio-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends LocalState<HeaderComponentState> implements OnInit {
  constructor(
    private authQuery: AuthQuery,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private breakpointObserverService: BreakpointObserverService,
    private router: Router,
    private scoreService: ScoreService,
    private globalListenersService: GlobalListenersService
  ) {
    super({ sideMenuOpened: false });
  }

  readonly user$ = this.authQuery.user$;
  readonly sideMenuOpened$ = this.selectState('sideMenuOpened');
  readonly pathToProfile$ = this.user$.pipe(
    map(user => {
      if (!user) {
        return [];
      }
      if (user.player?.id) {
        return ['/player', user.player.id];
      }
      return ['/player/u', user.id];
    })
  );
  readonly isLogged$ = this.authQuery.isLogged$;
  readonly isMobile$ = this.breakpointObserverService.isMobile$;
  readonly mdiTriangle = mdiTriangle;

  async logout(): Promise<void> {
    this.authService.logout();
    this.snackBarService.open('Logout successful!');
    await this.router.navigate(['/']);
  }

  toggleSideMenu($event: MouseEvent): void {
    $event.stopPropagation();
    this.updateState('sideMenuOpened', sideMenuOpened => !sideMenuOpened);
  }

  ngOnInit(): void {
    const updateCountApprovals$ = combineLatest([
      this.scoreService.onUpdateCountApprovals().pipe(startWith(void 0)),
      this.authQuery.isLogged$.pipe(filter(isLogged => isLogged)),
    ]).pipe(mapTo(void 0), debounceTime(50));
    updateCountApprovals$
      .pipe(
        withLatestFrom(this.user$),
        map(([, user]) => user),
        filterNil(),
        switchMap(user => {
          const requests$ = [this.scoreService.findChangeRequestsCount()];
          if (user.admin) {
            requests$.push(this.scoreService.findApprovalCount());
          }
          return forkJoin(requests$);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.globalListenersService.htmlClick$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.sideMenuOpened$),
        filter(([, sideMenuOpened]) => sideMenuOpened)
      )
      .subscribe(() => {
        this.updateState({ sideMenuOpened: false });
      });
  }
}
