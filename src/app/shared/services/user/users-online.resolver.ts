import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UserOnline } from '@model/user';
import { UserService } from '@shared/services/user/user.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersOnlineResolver implements Resolve<UserOnline[]> {
  private userService = inject(UserService);


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserOnline[]> | Promise<UserOnline[]> | UserOnline[] {
    return this.userService.getOnline();
  }
}
