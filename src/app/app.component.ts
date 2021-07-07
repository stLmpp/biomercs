import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '@shared/title/title.service';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { MetaService } from '@shared/meta/meta.service';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { DOCUMENT } from '@angular/common';
import { debounceTime, takeUntil } from 'rxjs';
import { WINDOW } from './core/window.service';

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
    @Inject(WINDOW) private window: Window
  ) {
    super();
  }

  isMobile$ = this.breakpointObserverService.isMobile$;

  private _defineHeightPropertyCss(): void {
    const vh = this.window.innerHeight * 0.01;
    this.document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  private _listenToResize(): void {
    this.globalListenersService.windowResize$.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe(() => {
      this._defineHeightPropertyCss();
    });
  }

  ngOnInit(): void {
    this._defineHeightPropertyCss();
    this._listenToResize();
    this.titleService.init();
    this.metaService.init();
  }

  override ngOnDestroy(): void {
    this.titleService.ngOnDestroy();
    this.metaService.ngOnDestroy();
    super.ngOnDestroy();
  }
}
