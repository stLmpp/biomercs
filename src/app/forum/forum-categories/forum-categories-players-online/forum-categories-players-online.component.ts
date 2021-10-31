import { ChangeDetectionStrategy, Component } from '@angular/core';
import { trackById } from '@util/track-by';
import { ForumService } from '../../service/forum.service';

@Component({
  selector: 'bio-forum-categories-players-online',
  templateUrl: './forum-categories-players-online.component.html',
  styleUrls: ['./forum-categories-players-online.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCategoriesPlayersOnlineComponent {
  constructor(private forumService: ForumService) {}

  readonly usersOnline$ = this.forumService.usersOnline$;
  readonly trackById = trackById;
}
