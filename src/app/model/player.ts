import { Region } from './region';
import { trackByFactory } from '@stlmpp/utils';

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
  personaName?: string;
  idUser?: number;
  idSteamProfile?: number;
  title?: string;
  aboutMe?: string;
  idRegion?: number;
}

export const trackByPlayer = trackByFactory<Player>('id');
