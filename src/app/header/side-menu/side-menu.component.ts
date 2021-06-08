import { ChangeDetectionStrategy, Component, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Animations } from '@shared/animations/animations';
import { User } from '@model/user';
import { HeaderQuery } from '../header.query';
import { mdiEmailSyncOutline, mdiTrophy } from '@mdi/js';

@Component({
  selector: 'bio-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.slide.inOut({ axis: 'X', opacity: false })],
  host: { '[@slideInOut]': '' },
})
export class SideMenuComponent {
  constructor(public headerQuery: HeaderQuery) {}

  @Input() user!: User;
  @Input() isMobile = false;

  @Output() readonly menuSelected = new EventEmitter<MouseEvent>();

  readonly mdiTrophy = mdiTrophy;
  readonly mdiEmailSyncOutline = mdiEmailSyncOutline;

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  onMenuSelected($event: MouseEvent): void {
    this.menuSelected.emit($event);
  }
}
