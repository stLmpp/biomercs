import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { shareReplay, take, takeUntil } from 'rxjs/operators';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { fromEvent, race, timer } from 'rxjs';
import { Animations } from '@shared/animations/animations';
import { mdiGithub, mdiSteam, mdiYoutube } from '@mdi/js';

@Component({
  selector: 'bio-stlmpp',
  templateUrl: './stlmpp.component.html',
  styleUrls: ['./stlmpp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.inOut()],
})
export class StlmppComponent extends Destroyable implements AfterViewInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    super();
  }

  @ViewChildren('fragment') fragments!: QueryList<ElementRef<HTMLElement>>;

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
    const fragmentElement = this.fragments.find(fragment => fragment.nativeElement.id === fragmentRouter);
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
