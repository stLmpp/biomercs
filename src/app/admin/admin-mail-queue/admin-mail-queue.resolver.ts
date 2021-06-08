import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MailStatusQueue } from '@model/mail';
import { MailService } from '@shared/services/mail/mail.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminMailQueueResolver implements Resolve<MailStatusQueue> {
  constructor(private mailService: MailService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MailStatusQueue> {
    return this.mailService.statusQueue();
  }
}
