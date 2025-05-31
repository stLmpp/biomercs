import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, viewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fromEvent, race, shareReplay, take, takeUntil, timer } from 'rxjs';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { Animations } from '@shared/animations/animations';
import { mdiGithub, mdiSteam, mdiYoutube } from '@mdi/js';
import { NgLetModule } from '@stlmpp/utils';
import { CardComponent } from '../shared/components/card/card.component';
import { CardTitleDirective } from '../shared/components/card/card-title.directive';
import { CardSubtitleDirective } from '../shared/components/card/card-subtitle.directive';
import { CardContentDirective } from '../shared/components/card/card-content.directive';
import { ButtonComponent } from '../shared/components/button/button.component';
import { IconMdiComponent } from '../shared/components/icon/icon-mdi.component';
import { IconComponent } from '../shared/components/icon/icon.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-stlmpp',
  templateUrl: './stlmpp.component.html',
  styleUrls: ['./stlmpp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.inOut()],
  host: { class: 'center-container' },
  imports: [
    NgLetModule,
    CardComponent,
    CardTitleDirective,
    CardSubtitleDirective,
    CardContentDirective,
    ButtonComponent,
    IconMdiComponent,
    RouterLink,
    IconComponent,
    AsyncPipe,
  ],
})
export class StlmppComponent extends Destroyable implements AfterViewInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  readonly fragments = viewChildren<ElementRef<HTMLElement>>('fragment');

  readonly mail = 'gui.stlmpp@hotmail.com';
  readonly mail2 = 'gui.stlmpp@gmail.com';
  readonly mailTo = encodeURI(`mailto:${this.mail}`);
  readonly mailTo2 = encodeURI(`mailto:${this.mail2}`);
  readonly fragment$ = this.activatedRoute.fragment.pipe(shareReplay());
  readonly mdiSteam = mdiSteam;
  readonly mdiGithub = mdiGithub;
  readonly mdiYoutube = mdiYoutube;

  private _getFragment(): string | null {
    return this.activatedRoute.snapshot.fragment;
  }

  private _addTimer(): void {
    const fragmentRouter = this._getFragment();
    if (!fragmentRouter) {
      return;
    }
    const fragmentElement = this.fragments().find(fragment => fragment.nativeElement.id === fragmentRouter);
    if (!fragmentElement) {
      return;
    }
    const mouseenter$ = fromEvent(fragmentElement.nativeElement, 'mouseenter').pipe(take(1));
    race(timer(5000), mouseenter$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate([], { relativeTo: this.activatedRoute }).then();
      });
  }

  ngAfterViewInit(): void {
    this.fragment$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this._addTimer();
    });
  }
}
