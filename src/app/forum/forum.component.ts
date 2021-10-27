import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ForumService } from './service/forum.service';

@Component({
  selector: 'bio-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumComponent implements OnInit, OnDestroy {
  constructor(private forumService: ForumService) {}

  ngOnInit(): void {
    this.forumService.init();
  }

  ngOnDestroy(): void {
    this.forumService.destroy();
  }
}
