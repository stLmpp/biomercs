import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserOnline } from '@model/user';
import { UserService } from '@shared/services/user/user.service';

export function usersOnlineResolver(): ResolveFn<UserOnline[]> {
  return () => {
    const userService = inject(UserService);
    return userService.getOnline();
  };
}
