import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '@shared/title/title.service';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { MetaService } from '@shared/meta/meta.service';

@Component({
  selector: 'bio-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private titleService: TitleService,
    private breakpointObserverService: BreakpointObserverService,
    private metaService: MetaService
  ) {}

  isMobile$ = this.breakpointObserverService.isMobile$;

  ngOnInit(): void {
    this.titleService.init();
    this.metaService.init();
  }

  ngOnDestroy(): void {
    this.titleService.ngOnDestroy();
    this.metaService.ngOnDestroy();
  }
}
