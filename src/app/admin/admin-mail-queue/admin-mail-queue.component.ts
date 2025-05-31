import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MailStatusQueue } from '@model/mail';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { MailService } from '@shared/services/mail/mail.service';
import { finalize, tap } from 'rxjs';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'bio-admin-mail-queue',
  templateUrl: './admin-mail-queue.component.html',
  styleUrls: ['./admin-mail-queue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CardTitleDirective, CardContentDirective, CardActionsDirective, ButtonComponent],
})
export class AdminMailQueueComponent {
  private activatedRoute = inject(ActivatedRoute);
  private mailService = inject(MailService);
  private changeDetectorRef = inject(ChangeDetectorRef);

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
