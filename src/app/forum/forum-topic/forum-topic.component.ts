import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TopicWithPosts } from '@model/forum/topic';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { skip, takeUntil } from 'rxjs';
import { trackByIndex } from '@util/track-by';

@Component({
  selector: 'bio-forum-topic',
  templateUrl: './forum-topic.component.html',
  styleUrls: ['./forum-topic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumTopicComponent extends Destroyable implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  topic: TopicWithPosts = this.activatedRoute.snapshot.data[RouteDataEnum.topicWithPosts];
  loading = false;

  readonly trackByIndex = trackByIndex;

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$), skip(1)).subscribe(data => {
      const topic: TopicWithPosts | undefined = data[RouteDataEnum.topicWithPosts];
      if (topic) {
        this.topic = topic;
      }
    });
  }

  async onPageChange($event: number): Promise<void> {
    this.loading = true;
    await this.router.navigate(['../', $event], { relativeTo: this.activatedRoute, skipLocationChange: true });
    this.loading = false;
    this.changeDetectorRef.markForCheck();
  }
}
