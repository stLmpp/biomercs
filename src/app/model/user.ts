export interface User {
  id: number;
  username: string;
  email: string;
  lastOnline?: Date;
  rememberMe?: boolean;
  admin: boolean;
  token: string;
  dateFormat: string;
  bannedDate?: Date | null;
  idPlayer?: number;
  playerPersonaName?: string;
}

export interface UserOnline {
  id: number;
  idPlayer: number;
  personaName: string;
}
