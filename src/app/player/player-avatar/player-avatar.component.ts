import { ChangeDetectionStrategy, Component, OnChanges, input } from '@angular/core';
import { SimpleChangesCustom } from '@util/util';
import { environment } from '@environment/environment';

@Component({
  selector: 'bio-player-avatar',
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerAvatarComponent implements OnChanges {
  readonly avatar = input<string | null>();
  readonly personaName = input.required<string>();

  avatarUrl = '';

  ngOnChanges(changes: SimpleChangesCustom<PlayerAvatarComponent>): void {
    const avatar = changes.avatar?.currentValue ?? this.avatar();
    const personaName = changes.personaName?.currentValue ?? this.personaName();
    if (avatar) {
      this.avatarUrl = `${environment.avatar}/${avatar}`;
    } else {
      this.avatarUrl = `https://avatars.dicebear.com/api/identicon/${personaName}.svg`;
    }
  }
}
