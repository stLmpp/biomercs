import { RawSteamProfile } from './steam-profile';
import { Region } from './region';
import { Base } from './base';

export interface Player extends Base {
  personaName: string;
  title?: string;
  aboutMe?: string;
  idUser?: number;
  idSteamProfile?: number;
  steamProfile?: RawSteamProfile;
  noUser: boolean;
  idRegion: number;
  region?: Region;
}

export interface PlayerAdd {
  personaName: string;
  idUser?: number;
  idSteamProfile?: number;
  title?: string;
  aboutMe?: string;
  idRegion?: number;
}
export interface PlayerUpdate {
  personaName?: string;
  idUser?: number;
  idSteamProfile?: number;
  title?: string;
  aboutMe?: string;
  idRegion?: number;
}
