import { Player } from './player';
import { trackByFactory } from '@stlmpp/utils';

export interface User {
  id: number;
  username: string;
  email: string;
  lastOnline?: Date;
  rememberMe?: boolean;
  admin: boolean;
  token: string;
  player?: Player;
  dateFormat: string;
  bannedDate?: Date | null;
}

export interface UserUpdate {
  lastOnline?: Date;
  rememberMe?: boolean;
  dateFormat?: string;
}

export const trackByUser = trackByFactory<User>('id');
