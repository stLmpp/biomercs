import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';
import { ScoreService } from '../score/score.service';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { mdiTriangle } from '@mdi/js';
import { filterNil } from '@util/operators/filter';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { NgLetModule } from '@stlmpp/utils';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { IconComponent } from '../shared/components/icon/icon.component';
import { NotificationsIconComponent } from '../notification/notifications-icon/notifications-icon.component';
import { TooltipDirective } from '../shared/components/tooltip/tooltip.directive';
import { MenuTriggerDirective } from '../shared/components/menu/menu-trigger.directive';
import { IconMdiComponent } from '../shared/components/icon/icon-mdi.component';
import { MenuComponent } from '../shared/components/menu/menu.component';
import { MenuItemButtonDirective } from '../shared/components/menu/menu-item.directive';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgLetModule,
    SideMenuComponent,
    ButtonComponent,
    IconComponent,
    RouterLink,
    NotificationsIconComponent,
    TooltipDirective,
    MenuTriggerDirective,
    IconMdiComponent,
    MenuComponent,
    MenuItemButtonDirective,
    AsyncPipe,
  ],
})
export class HeaderComponent extends Destroyable implements OnInit {
  private authQuery = inject(AuthQuery);
  private authService = inject(AuthService);
  private snackBarService = inject(SnackBarService);
  private breakpointObserverService = inject(BreakpointObserverService);
  private router = inject(Router);
  private scoreService = inject(ScoreService);
  private globalListenersService = inject(GlobalListenersService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  readonly user$ = this.authQuery.user$;
  readonly isLogged$ = this.authQuery.isLogged$;
  readonly isMobile$ = this.breakpointObserverService.isMobile$;
  readonly mdiTriangle = mdiTriangle;

  sideMenuOpened = false;

  async logout(): Promise<void> {
    this.authService.logout();
    this.snackBarService.open('Logout successful!');
    await this.router.navigate(['/']);
  }

  toggleSideMenu($event: MouseEvent): void {
    $event.stopPropagation();
    this.sideMenuOpened = !this.sideMenuOpened;
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
        filter(() => this.sideMenuOpened)
      )
      .subscribe(() => {
        this.sideMenuOpened = !this.sideMenuOpened;
        this.changeDetectorRef.markForCheck();
      });
  }
}
