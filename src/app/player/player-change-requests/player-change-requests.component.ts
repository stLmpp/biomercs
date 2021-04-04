import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bio-player-change-requests',
  templateUrl: './player-change-requests.component.html',
  styleUrls: ['./player-change-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerChangeRequestsComponent {
  constructor() {}
}
