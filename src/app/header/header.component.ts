import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { AuthService } from '../auth/auth.service';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { map } from 'rxjs/operators';
import {
  BreakpointObserverService,
  MediaQueryEnum,
} from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bio-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(
    private authQuery: AuthQuery,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private breakpointObserverService: BreakpointObserverService,
    private router: Router
  ) {}

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
  isLogged$ = this.authQuery.isLogged$;

  isMediumScreen$ = this.breakpointObserverService.observe([MediaQueryEnum.md]);

  async logout(): Promise<void> {
    this.authService.logout();
    this.snackBarService.open('Logout successful!');
    await this.router.navigate(['/']);
  }
}
