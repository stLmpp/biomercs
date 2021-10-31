import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '@shared/title/title.service';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { MetaService } from '@shared/meta/meta.service';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { DOCUMENT } from '@angular/common';
import { auditTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs';
import { WINDOW } from './core/window.service';
import { BreadcrumbsService } from '@shared/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'bio-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends Destroyable implements OnInit, OnDestroy {
  constructor(
    private titleService: TitleService,
    private breakpointObserverService: BreakpointObserverService,
    private metaService: MetaService,
    private globalListenersService: GlobalListenersService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private breadcrumbsService: BreadcrumbsService
  ) {
    super();
  }

  readonly isMobile$ = this.breakpointObserverService.isMobile$;

  private _getVh(): number {
    return this.window.innerHeight * 0.01;
  }

  private _listenToResize(): void {
    this.globalListenersService.windowResize$
      .pipe(
        takeUntil(this.destroy$),
        auditTime(200),
        map(() => this._getVh()),
        distinctUntilChanged(),
        startWith(this._getVh())
      )
      .subscribe(vh => {
        this.document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
  }

  ngOnInit(): void {
    this._listenToResize();
    this.metaService.init();
    this.titleService.title$.pipe(takeUntil(this.destroy$)).subscribe();
    this.breadcrumbsService.init();
  }

  override ngOnDestroy(): void {
    this.metaService.ngOnDestroy();
    this.breadcrumbsService.destroy();
    super.ngOnDestroy();
  }
}
