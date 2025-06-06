import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { finalize, map, Observable, takeUntil, tap } from 'rxjs';
import { Animations } from '@shared/animations/animations';
import { overlayPositions } from '@util/overlay';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { Notification } from '@model/notification';
import { Pagination, PaginationMeta } from '@model/pagination';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { DynamicLoaderService } from '../../core/dynamic-loader.service';
import { arrayUtil } from 'st-utils';

interface NotificationCustom extends Notification {
  loading?: boolean;
  readLoading?: boolean;
}

@Component({
  selector: 'bio-notifications-icon',
  templateUrl: './notifications-icon.component.html',
  styleUrls: ['./notifications-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.inOut(100), Animations.scale.in(100, 0.8)],
})
export class NotificationsIconComponent extends Destroyable implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef,
    private breakpointObserverService: BreakpointObserverService,
    private dynamicLoaderService: DynamicLoaderService
  ) {
    super();
  }

  private _preloaded = false;

  readonly unseenCount$ = this.notificationService.unseenCount$.pipe(
    map(unreadCount => (unreadCount > 99 ? '99+' : unreadCount))
  );

  overlayIsOpen = false;

  readonly overlayPositions: ConnectedPosition[] = [
    { ...overlayPositions().bottom, offsetY: 2, overlayX: 'center', originX: 'center' },
  ];
  readonly offsetY$ = this.breakpointObserverService.isMobile$.pipe(map(isMobile => (isMobile ? -50 : 0)));

  notifications: NotificationCustom[] = [];
  loading = true;
  loadingMore = false;
  page = 1;
  meta: PaginationMeta = { currentPage: 1, itemsPerPage: 25, totalItems: 50, totalPages: 2, itemCount: 25 };

  private _addNotifications(notifications: Notification[]): void {
    this.notifications = arrayUtil(this.notifications, 'id').upsert(notifications).orderBy('id', 'desc').toArray();
  }

  private _getNotifications(page: number): Observable<Pagination<Notification>> {
    return this.notificationService.get(page, 25).pipe(
      tap(({ meta, items }) => {
        this._addNotifications(items);
        this.meta = meta;
      })
    );
  }

  private _getFirstPage(): Observable<Pagination<Notification>> {
    return this._getNotifications(1).pipe(
      finalize(() => {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  pageChange(page: number): void {
    this.loadingMore = true;
    this.page = page;
    this._getNotifications(page)
      .pipe(
        finalize(() => {
          this.loadingMore = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  onClick(): void {
    if (!this._preloaded) {
      this._getFirstPage().subscribe();
    }
    this.overlayIsOpen = !this.overlayIsOpen;
  }

  preloadNotifications(): void {
    if (this._preloaded) {
      return;
    }
    this.dynamicLoaderService.preloadRequest(
      this._getFirstPage().pipe(
        tap(() => {
          this._preloaded = true;
        })
      )
    );
  }

  ngOnInit(): void {
    this.notificationService.unseenCount().subscribe();
    this.notificationService
      .listen()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this._addNotifications(notifications);
        this.changeDetectorRef.markForCheck();
      });
  }
}
