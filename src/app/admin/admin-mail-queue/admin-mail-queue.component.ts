import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MailStatusQueue } from '@model/mail';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { LocalState } from '@stlmpp/store';
import { MailService } from '@shared/services/mail/mail.service';
import { tap } from 'rxjs';
import { catchAndThrow } from '@util/operators/catch-and-throw';

interface AdminMailQueueComponentState {
  restartingQueue: boolean;
  statusQueue: MailStatusQueue;
}

@Component({
  selector: 'bio-admin-mail-queue',
  templateUrl: './admin-mail-queue.component.html',
  styleUrls: ['./admin-mail-queue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMailQueueComponent extends LocalState<AdminMailQueueComponentState> {
  constructor(private activatedRoute: ActivatedRoute, private mailService: MailService) {
    super({ restartingQueue: false, statusQueue: activatedRoute.snapshot.data[RouteDataEnum.mailQueue] });
  }

  readonly restartingQueue$ = this.selectState('restartingQueue');
  readonly statusQueue$ = this.selectState('statusQueue');

  restartQueue(): void {
    this.updateState({ restartingQueue: true });
    this.mailService
      .restartQueue()
      .pipe(
        tap(statusQueue => {
          this.updateState({ statusQueue, restartingQueue: false });
        }),
        catchAndThrow(() => {
          this.updateState({ restartingQueue: false });
        })
      )
      .subscribe();
  }
}
