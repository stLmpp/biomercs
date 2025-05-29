import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MailStatusQueue } from '@model/mail';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { MailService } from '@shared/services/mail/mail.service';
import { finalize, tap } from 'rxjs';

@Component({
    selector: 'bio-admin-mail-queue',
    templateUrl: './admin-mail-queue.component.html',
    styleUrls: ['./admin-mail-queue.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AdminMailQueueComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private mailService: MailService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  restartingQueue = false;
  statusQueue: MailStatusQueue = this.activatedRoute.snapshot.data[RouteDataEnum.mailQueue];

  restartQueue(): void {
    this.restartingQueue = true;
    this.mailService
      .restartQueue()
      .pipe(
        tap(statusQueue => {
          this.statusQueue = statusQueue;
          this.restartingQueue = false;
        }),
        finalize(() => {
          this.restartingQueue = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }
}
