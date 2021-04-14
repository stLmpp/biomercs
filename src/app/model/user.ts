import { Player } from './player';

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
}
