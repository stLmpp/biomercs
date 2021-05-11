import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '@shared/title/title.service';

@Component({
  selector: 'bio-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.init();
  }

  ngOnDestroy(): void {
    this.titleService.ngOnDestroy();
  }
}
