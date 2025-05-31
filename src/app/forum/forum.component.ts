import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ForumService } from './service/forum.service';
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'bio-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BreadcrumbsComponent, RouterOutlet],
})
export class ForumComponent implements OnInit, OnDestroy {
  private forumService = inject(ForumService);

  ngOnInit(): void {
    this.forumService.init();
  }

  ngOnDestroy(): void {
    this.forumService.destroy();
  }
}
