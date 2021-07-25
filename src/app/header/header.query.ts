import { Injectable } from '@angular/core';
import { Query } from '@stlmpp/store';
import { HeaderState, HeaderStore } from './header.store';

@Injectable({ providedIn: 'root' })
export class HeaderQuery extends Query<HeaderState> {
  constructor(headerStore: HeaderStore) {
    super(headerStore);
  }

  adminApprovalCount$ = this.select('adminApprovalCount');
  playerRequestChangesCount$ = this.select('playerRequestChangesCount');
}
