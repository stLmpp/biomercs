import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MailStatusQueue } from '@model/mail';
import { MailService } from '@shared/services/mail/mail.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminMailQueueResolver  {
  private mailService = inject(MailService);


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MailStatusQueue> {
    return this.mailService.statusQueue();
  }
}
