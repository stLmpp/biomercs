import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TopicRecent } from '@model/forum/topic';
import { trackById } from '@util/track-by';
import { RouterLink } from '@angular/router';
import { AuthDateFormatPipe } from '../../../auth/shared/auth-date-format.pipe';

@Component({
  selector: 'bio-forum-categories-recent-topics',
  templateUrl: './forum-categories-recent-topics.component.html',
  styleUrls: ['./forum-categories-recent-topics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AuthDateFormatPipe],
})
export class ForumCategoriesRecentTopicsComponent {
  readonly recentTopics = input<TopicRecent[]>([]);

  readonly trackBy = trackById;
}
