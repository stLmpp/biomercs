import { Injectable } from '@angular/core';
import { Store } from '@stlmpp/store';

export interface HeaderState {
  playerApprovalCount: number;
  adminApprovalCount: number;
  playerRequestChangesCount: number;
}

@Injectable({ providedIn: 'root' })
export class HeaderStore extends Store<HeaderState> {
  constructor() {
    super({
      name: 'header',
      initialState: { adminApprovalCount: 0, playerApprovalCount: 0, playerRequestChangesCount: 0 },
    });
  }
}