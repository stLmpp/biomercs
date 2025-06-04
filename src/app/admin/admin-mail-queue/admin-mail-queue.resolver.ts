import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MailStatusQueue } from '@model/mail';
import { MailService } from '@shared/services/mail/mail.service';

export function adminMailQueueResolver(): ResolveFn<MailStatusQueue> {
  return () => inject(MailService).statusQueue();
}
