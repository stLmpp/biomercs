import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from '@model/forum/post';

@Component({
  selector: 'bio-forum-topic-post',
  templateUrl: './forum-topic-post.component.html',
  styleUrls: ['./forum-topic-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumTopicPostComponent {
  @Input() post!: Post;
}
