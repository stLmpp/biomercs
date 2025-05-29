import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, DOCUMENT } from '@angular/core';
import { TitleService } from '@shared/title/title.service';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { MetaService } from '@shared/meta/meta.service';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { Destroyable } from '@shared/components/common/destroyable-component';

import { auditTime, distinctUntilChanged, from, map, startWith } from 'rxjs';
import { WINDOW } from './core/window.service';
import { BreadcrumbsService } from '@shared/breadcrumbs/breadcrumbs.service';
import { SwUpdate } from '@angular/service-worker';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';

@Component({
    selector: 'bio-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppComponent extends Destroyable implements OnInit, OnDestroy {
  constructor(
    private titleService: TitleService,
    private breakpointObserverService: BreakpointObserverService,
    private metaService: MetaService,
    private globalListenersService: GlobalListenersService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private breadcrumbsService: BreadcrumbsService,
    private swUpdate: SwUpdate,
    private dialogService: DialogService
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
        this.takeUntilDestroy(),
        auditTime(200),
        map(() => this._getVh()),
        distinctUntilChanged(),
        startWith(this._getVh())
      )
      .subscribe(vh => {
        this.document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
  }

  private _listenToSwUpdate(): void {
    this.swUpdate.available.pipe(this.takeUntilDestroy()).subscribe(() => {
      this.dialogService
        .info({
          title: `There's a new version of the app`,
          content: 'The app will updated and then reloaded',
          buttons: [
            {
              title: 'Update and reload',
              action: () => from(this.swUpdate.activateUpdate().then(() => this.document.location.reload())),
              type: 'primary',
            },
          ],
        })
        .then();
    });
  }

  ngOnInit(): void {
    this._listenToResize();
    this._listenToSwUpdate();
    this.metaService.init();
    this.titleService.title$.pipe(this.takeUntilDestroy()).subscribe();
    this.breadcrumbsService.init();
  }

  override ngOnDestroy(): void {
    this.metaService.ngOnDestroy();
    this.breadcrumbsService.destroy();
    super.ngOnDestroy();
  }
}
