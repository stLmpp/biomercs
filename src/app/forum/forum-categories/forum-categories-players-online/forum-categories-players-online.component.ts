import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ForumService } from '../../service/forum.service';
import { trackByFactory } from '@stlmpp/utils';
import { UserOnline } from '@model/user';

@Component({
  selector: 'bio-forum-categories-players-online',
  templateUrl: './forum-categories-players-online.component.html',
  styleUrls: ['./forum-categories-players-online.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCategoriesPlayersOnlineComponent {
  constructor(private forumService: ForumService) {}

  readonly usersOnline$ = this.forumService.usersOnline$;
  readonly trackById = trackByFactory<UserOnline>();
}
