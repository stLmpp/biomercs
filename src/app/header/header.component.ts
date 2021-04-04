import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { AuthService } from '../auth/auth.service';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { Router } from '@angular/router';
import { HeaderQuery } from './header.query';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { forkJoin, of } from 'rxjs';
import { ScoreService } from '../score/score.service';
import { filterNil } from '@shared/operators/filter';

@Component({
  selector: 'bio-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends Destroyable implements OnInit {
  constructor(
    private authQuery: AuthQuery,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private breakpointObserverService: BreakpointObserverService,
    private router: Router,
    public headerQuery: HeaderQuery,
    private scoreService: ScoreService
  ) {
    super();
  }

  user$ = this.authQuery.user$;
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
  pathToScoreApproval$ = this.user$.pipe(
    map(user => {
      if (!user) {
        return [];
      }
      if (user.player?.id) {
        return ['/player', user.player.id, 'approval'];
      }
      return ['/player/u', user.id, 'approval'];
    })
  );
  pathToScoreChangeRequests$ = this.user$.pipe(
    map(user => {
      if (!user) {
        return [];
      }
      if (user.player?.id) {
        return ['/player', user.player.id, 'change-requests'];
      }
      return ['player/u', user.id, 'change-requests'];
    })
  );
  isLogged$ = this.authQuery.isLogged$;

  isMediumScreen$ = this.breakpointObserverService.observe([], ['(min-width: 1124px)']);

  async logout(): Promise<void> {
    this.authService.logout();
    this.snackBarService.open('Logout successful!');
    await this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.user$
      .pipe(
        takeUntil(this.destroy$),
        filterNil(),
        switchMap(user => {
          const requests$ = [this.scoreService.findApprovalCount(true), this.scoreService.findChangeRequestsCount()];
          if (user.admin) {
            requests$.push(this.scoreService.findApprovalCount(false));
          }
          return forkJoin(requests$);
        })
      )
      .subscribe();
  }
}
