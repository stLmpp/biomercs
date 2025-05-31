import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { SimpleChangesCustom } from '@util/util';
import { environment } from '@environment/environment';

@Component({
  selector: 'bio-player-avatar',
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerAvatarComponent implements OnChanges {
  @Input() avatar: string | null | undefined;
  @Input() personaName!: string;

  avatarUrl = '';

  ngOnChanges(changes: SimpleChangesCustom<PlayerAvatarComponent>): void {
    const avatar = changes.avatar?.currentValue ?? this.avatar;
    const personaName = changes.personaName?.currentValue ?? this.personaName;
    if (avatar) {
      this.avatarUrl = `${environment.avatar}/${avatar}`;
    } else {
      this.avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${personaName}`;
    }
  }
}
