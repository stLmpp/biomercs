import { Base } from './base';
import { Player } from './player';

export interface User extends Base {
  username: string;
  email: string;
  lastOnline?: Date;
  rememberMe?: boolean;
  admin: boolean;
  token?: string;
  player?: Player;
}
