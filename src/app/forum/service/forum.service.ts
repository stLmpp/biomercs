import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { UserOnline } from '@model/user';
import { AuthService } from '../../auth/auth.service';
import { arrayUtil } from 'st-utils';
import { UserService } from '@shared/services/user/user.service';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private authService = inject(AuthService);
  private userService = inject(UserService);


  private readonly _destroy$ = new Subject<void>();
  private readonly _usersOnline$ = new BehaviorSubject<UserOnline[]>([]);

  readonly usersOnline$ = this._usersOnline$.asObservable();

  private _setUsersOnline(callback: (usersOnline: UserOnline[]) => UserOnline[]): void {
    this._usersOnline$.next(callback([...this._usersOnline$.value]));
  }

  hasUser(idUser: number): boolean {
    return this._usersOnline$.value.some(user => user.id === idUser);
  }

  init(): void {
    this.userService.getOnline().subscribe(initialUsers => {
      this._setUsersOnline(usersOnline => arrayUtil(usersOnline).upsert(initialUsers).toArray());
    });
    this.authService
      .userOnlineSocket()
      .pipe(
        takeUntil(this._destroy$),
        filter(userOnline => !this.hasUser(userOnline.id))
      )
      .subscribe(userOnline => {
        this._setUsersOnline(usersOnline => [...usersOnline, userOnline]);
      });
    this.authService
      .userOfflineSocket()
      .pipe(takeUntil(this._destroy$))
      .subscribe(idUser => {
        this._setUsersOnline(usersOnline => arrayUtil(usersOnline).remove(idUser).toArray());
      });
  }

  destroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
