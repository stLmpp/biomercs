import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bio-player-approval',
  templateUrl: './player-approval.component.html',
  styleUrls: ['./player-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerApprovalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
