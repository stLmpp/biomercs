import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bio-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumComponent {}
