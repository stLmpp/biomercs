import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Destroyable } from '@shared/components/common/destroyable-component';
import {
  isNotificationExtraPost,
  isNotificationExtraScore,
  Notification,
  NotificationExtraPost,
  NotificationExtraScore,
} from '@model/notification';
import { finalize, lastValueFrom, Observable, of, switchMap, tap } from 'rxjs';
import { trackById } from '@util/track-by';
import { ScoreService } from '../../score/score.service';
import { ScoreModalService } from '../../score/score-modal.service';
import { PaginationMeta } from '@model/pagination';
import { refreshMap } from '@util/operators/refresh-map';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { NotificationTypeEnum } from '@model/enum/notification-type-enum';
import { ScoreStatusEnum } from '@model/enum/score-status.enum';
import { PlayerModalService } from '../../player/player-modal.service';
import { arrayUtil } from 'st-utils';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ListDirective, ListSelectable } from '../../shared/components/list/list.directive';
import { LoadingDirective } from '../../shared/components/spinner/loading/loading.directive';
import { ɵɵCdkVirtualScrollViewport, ɵɵCdkFixedSizeVirtualScroll, ɵɵCdkVirtualForOf } from '@angular/cdk/overlay';
import { ListItemComponent } from '../../shared/components/list/list-item.component';
import { ListItemLineDirective } from '../../shared/components/list/list-item-line.directive';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SuffixDirective } from '../../shared/components/common/suffix.directive';
import { MenuTriggerDirective } from '../../shared/components/menu/menu-trigger.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { MenuItemButtonDirective } from '../../shared/components/menu/menu-item.directive';

interface NotificationCustom extends Notification {
  loading?: boolean;
  readLoading?: boolean;
  deleteLoading?: boolean;
}

@Component({
  selector: 'bio-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'notifications' },
  imports: [
    ButtonComponent,
    ListDirective,
    ListSelectable,
    LoadingDirective,
    ɵɵCdkVirtualScrollViewport,
    ɵɵCdkFixedSizeVirtualScroll,
    ɵɵCdkVirtualForOf,
    ListItemComponent,
    ListItemLineDirective,
    SpinnerComponent,
    SuffixDirective,
    MenuTriggerDirective,
    IconComponent,
    MenuComponent,
    MenuItemButtonDirective,
  ],
})
export class NotificationsComponent extends Destroyable implements OnInit {
  private notificationService = inject(NotificationService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private scoreService = inject(ScoreService);
  private scoreModalService = inject(ScoreModalService);
  private dialogService = inject(DialogService);
  private playerModalService = inject(PlayerModalService);
  private router = inject(Router);


  @Input() notifications: NotificationCustom[] = [];
  @Output() readonly notificationsChange = new EventEmitter<NotificationCustom[]>();
  @Input() page = 1;
  @Input() meta!: PaginationMeta;
  @Output() readonly pageChange = new EventEmitter<number>();
  @Input() loading = false;
  @Input() loadingMore = false;
  @Output() readonly closeOverlay = new EventEmitter<void>();

  readAllLoading = false;
  deleteAllLoading = false;

  readonly trackById = trackById;

  private _setNotifications(callback: (notifications: NotificationCustom[]) => NotificationCustom[]): void {
    this.notifications = callback(this.notifications);
    this.notificationsChange.emit(this.notifications);
    this.changeDetectorRef.markForCheck();
  }

  private _updateNotification(
    idNotification: number | ((entity: NotificationCustom) => boolean),
    partial: Partial<NotificationCustom> | ((notification: NotificationCustom) => NotificationCustom)
  ): void {
    this._setNotifications(notifications => arrayUtil(notifications, 'id').update(idNotification, partial).toArray());
  }

  private _maskAsRead(notification: NotificationCustom): Observable<number | null> {
    if (notification.read) {
      return of(null);
    }
    return this.notificationService.read(notification.id).pipe(
      tap(() => {
        this._updateNotification(notification.id, { read: true });
      })
    );
  }

  async openModal(notification: NotificationCustom): Promise<void> {
    if (notification.extra) {
      if (isNotificationExtraScore(notification.extra)) {
        if (
          notification.idNotificationType === NotificationTypeEnum.ScoreRequestedChanges &&
          notification.extra.idScoreStatus === ScoreStatusEnum.ChangesRequested
        ) {
          this.openModalChangeRequests(notification, notification.extra);
        } else {
          this.openModalScore(notification, notification.extra);
        }
      }
      if (isNotificationExtraPost(notification.extra)) {
        await this.navigateToPost(notification, notification.extra);
      }
    } else {
      this._updateNotification(notification.id, { loading: true });
      await Promise.all([
        lastValueFrom(this._maskAsRead(notification)),
        this.dialogService.info({ content: notification.content, buttons: ['Close'] }, { width: 300, minHeight: 100 }),
      ]);
      this._updateNotification(notification.id, { loading: false });
    }
  }

  openModalScore(notification: NotificationCustom, extra: NotificationExtraScore): void {
    const { loading, id } = notification;
    const { idScore } = extra;
    if (loading) {
      return;
    }
    this._updateNotification(id, { loading: true });
    this.scoreService
      .findById(idScore)
      .pipe(
        refreshMap(() => this._maskAsRead(notification)),
        switchMap(score =>
          this.scoreModalService.openModalScoreInfo({ score, showWorldRecord: true, showApprovalDate: true })
        ),
        finalize(() => {
          this._updateNotification(id, { loading: false });
        })
      )
      .subscribe();
  }

  openModalChangeRequests(notification: NotificationCustom, extra: NotificationExtraScore): void {
    const { loading, id } = notification;
    const { idScore } = extra;
    if (loading) {
      return;
    }
    this._updateNotification(id, { loading: true });
    this.scoreService
      .findByIdWithChangeRequests(idScore)
      .pipe(
        refreshMap(() => this._maskAsRead(notification)),
        switchMap(score => this.playerModalService.openPlayerChangeRequestsModal({ score })),
        finalize(() => {
          this._updateNotification(id, { loading: false });
        })
      )
      .subscribe();
  }

  async navigateToPost(notification: NotificationCustom, extra: NotificationExtraPost): Promise<void> {
    const { loading, id } = notification;
    const { idCategory, idSubCategory, pageSubCategory, idTopic, pageTopic, idPost } = extra;
    if (loading) {
      return;
    }
    this._updateNotification(id, { loading: true });
    await lastValueFrom(this._maskAsRead(notification));
    this.closeOverlay.emit();
    await this.router.navigate(
      [
        '/forum',
        'category',
        idCategory,
        'sub-category',
        idSubCategory,
        'page',
        pageSubCategory,
        'topic',
        idTopic,
        'page',
        pageTopic,
      ],
      { fragment: '' + idPost }
    );
    this._updateNotification(id, { loading: false });
  }

  onScrolledIndexChange(firstIndex: number): void {
    /* firstIndex + 12 is more or less the number of items in the screen + offsets
     * if it's higher than the number of notifications, it means more notifications needs to be fetched
     *
     * this.page < this.meta.totalPages: check if the current page is lower than the total number of pages, for obvious reasons
     *
     * !this.loadingMore: and for last check if the notifications are being fetched already
     */
    if (firstIndex + 12 >= this.notifications.length && this.page < this.meta.totalPages && !this.loadingMore) {
      this.pageChange.emit(this.page + 1);
    }
  }

  toggleRead(notification: NotificationCustom): void {
    if (notification.readLoading) {
      return;
    }
    this._updateNotification(notification.id, { readLoading: true });
    const request$: Observable<void | number> = notification.read
      ? this.notificationService.unread(notification.id)
      : this.notificationService.read(notification.id);
    request$
      .pipe(
        finalize(() => {
          this._updateNotification(notification.id, { read: !notification.read, readLoading: false });
        })
      )
      .subscribe();
  }

  readAll(): void {
    this.readAllLoading = true;
    this.notificationService
      .readAll()
      .pipe(
        tap(() => {
          this._updateNotification(() => true, { read: true });
        }),
        finalize(() => {
          this.readAllLoading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  deleteAll(): void {
    this.deleteAllLoading = true;
    this.dialogService.confirm({
      title: 'Delete all notifications',
      content: `This action can't be undone.`,
      buttons: [
        'Close',
        {
          title: 'Delete all',
          type: 'danger',
          action: () =>
            this.notificationService.deleteAll().pipe(
              finalize(() => {
                this.deleteAllLoading = false;
                this.changeDetectorRef.markForCheck();
              }),
              tap(() => {
                this._setNotifications(() => []);
              })
            ),
        },
      ],
    });
  }

  delete(notification: NotificationCustom): void {
    this._updateNotification(notification.id, { deleteLoading: true });
    this.notificationService
      .delete(notification.id)
      .pipe(
        finalize(() => {
          this._updateNotification(notification.id, { deleteLoading: false });
        })
      )
      .subscribe(() => {
        this._setNotifications(notifications =>
          notifications.filter(_notification => _notification.id !== notification.id)
        );
      });
  }

  ngOnInit(): void {
    this.notificationService.seenAll().subscribe();
  }
}
