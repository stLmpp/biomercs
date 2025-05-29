import { ChangeDetectionStrategy, Component } from '@angular/core';
import { trackById } from '@util/track-by';
import { ForumService } from '../../service/forum.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-forum-categories-players-online',
  templateUrl: './forum-categories-players-online.component.html',
  styleUrls: ['./forum-categories-players-online.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AsyncPipe],
})
export class ForumCategoriesPlayersOnlineComponent {
  constructor(private forumService: ForumService) {}

  readonly usersOnline$ = this.forumService.usersOnline$;
  readonly trackById = trackById;
}
