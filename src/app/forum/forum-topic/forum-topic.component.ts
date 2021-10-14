import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TopicWithPosts } from '@model/forum/topic';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { finalize, skip, takeUntil } from 'rxjs';
import { trackById, trackByIndex } from '@util/track-by';
import { Post } from '@model/forum/post';
import { arrayUtil } from 'st-utils';
import { TopicService } from '../service/topic.service';

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
    private changeDetectorRef: ChangeDetectorRef,
    private topicService: TopicService
  ) {
    super();
  }

  topic: TopicWithPosts = this.activatedRoute.snapshot.data[RouteDataEnum.topicWithPosts];
  loading = false;
  replying = false;

  readonly trackById = trackById;

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
    await this.router.navigate(['../', $event], { relativeTo: this.activatedRoute });
    this.loading = false;
    this.changeDetectorRef.markForCheck();
  }

  onPostChange(postUpdate: Post): void {
    const topic = this.topic;
    this.topic = {
      ...topic,
      posts: { ...topic.posts, items: arrayUtil(topic.posts.items).update(postUpdate.id, postUpdate).toArray() },
    };
  }

  onPostDelete(): void {
    this.loading = true;
    this.topicService
      .getByIdWithPosts(this.topic.id, this.topic.posts.meta.currentPage, this.topic.posts.meta.itemsPerPage)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(topic => {
        this.topic = topic;
      });
  }

  async onAfterSubmitPost($event: Post): Promise<void> {
    this.replying = false;
    const lastPage = Math.ceil((this.topic.posts.meta.totalItems + 1) / this.topic.posts.meta.itemsPerPage);
    if (lastPage === this.topic.posts.meta.currentPage) {
      this.topic = {
        ...this.topic,
        posts: {
          ...this.topic.posts,
          items: [
            ...this.topic.posts.items.map(post => {
              if (post.idPlayer === $event.idPlayer) {
                post = { ...post, postCount: post.postCount + 1 };
              }
              return post;
            }),
            $event,
          ],
        },
      };
      this.changeDetectorRef.markForCheck();
    } else {
      await this.onPageChange(lastPage);
    }
  }
}
