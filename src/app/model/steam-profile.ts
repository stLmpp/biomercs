export interface SteamProfile {
  id: number;
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags: number;
  gameextrainfo?: string;
  gameid?: string;
  loccountrycode?: string;
}

export enum SteamGatewayEvents {
  playerLinked = 'player-linked',
}

export class SteamPlayerLinkedSocketViewModel {
  steamProfile?: SteamProfile;
  error?: string;
}
