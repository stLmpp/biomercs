import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserOnline } from '@model/user';
import { ActivatedRoute } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { AuthService } from '../../../auth/auth.service';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { filter, takeUntil } from 'rxjs';
import { arrayUtil } from 'st-utils';
import { trackById } from '@util/track-by';

@Component({
  selector: 'bio-forum-categories-players-online',
  templateUrl: './forum-categories-players-online.component.html',
  styleUrls: ['./forum-categories-players-online.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCategoriesPlayersOnlineComponent extends Destroyable implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  usersOnline: UserOnline[] = this.activatedRoute.snapshot.data[RouteDataEnum.usersOnline] ?? [];

  readonly trackById = trackById;

  ngOnInit(): void {
    this.authService
      .userOnlineSocket()
      .pipe(
        takeUntil(this.destroy$),
        filter(userOnline => !this.usersOnline.some(user => user.id === userOnline.id))
      )
      .subscribe(userOnline => {
        this.usersOnline = [...this.usersOnline, userOnline];
        this.changeDetectorRef.markForCheck();
      });
    this.authService
      .userOfflineSocket()
      .pipe(takeUntil(this.destroy$))
      .subscribe(idUser => {
        this.usersOnline = arrayUtil(this.usersOnline).remove(idUser).toArray();
        this.changeDetectorRef.markForCheck();
      });
  }
}
