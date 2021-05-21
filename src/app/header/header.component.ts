import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { AuthService } from '../auth/auth.service';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { debounceTime, filter, map, mapTo, startWith, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import {
  BreakpointObserverService,
  MediaQueryEnum,
} from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { Router } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { ScoreService } from '../score/score.service';
import { LocalState } from '@stlmpp/store';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';

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

  user$ = this.authQuery.user$;

  sideMenuOpened$ = this.selectState('sideMenuOpened');

  pathToProfile$ = this.user$.pipe(
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
  isLogged$ = this.authQuery.isLogged$;

  isSmallScreen$ = this.breakpointObserverService.observe([MediaQueryEnum.sm]);

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
        filter(([, user]) => !!user),
        switchMap(([, user]) => {
          const requests$ = [this.scoreService.findApprovalCount(true), this.scoreService.findChangeRequestsCount()];
          if (user!.admin) {
            requests$.push(this.scoreService.findApprovalCount(false));
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
