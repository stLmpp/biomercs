import { Region } from './region';
import { trackByFactory } from '@stlmpp/utils';
import { SteamProfile } from '@model/steam-profile';

export interface Player {
  id: number;
  personaName: string;
  title?: string;
  aboutMe?: string;
  idUser?: number;
  idSteamProfile?: number;
  noUser: boolean;
  idRegion: number;
  region?: Region;
  steamProfile?: SteamProfile;
}

export interface PlayerAdd {
  personaName: string;
  idUser?: number;
  idSteamProfile?: number;
  title?: string;
  aboutMe?: string;
  idRegion?: number;
  steamid?: string;
}

export interface PlayerUpdate {
  idSteamProfile?: number;
  title?: string;
  aboutMe?: string;
  idRegion?: number;
}

export const trackByPlayer = trackByFactory<Player>('id');
