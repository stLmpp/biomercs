import { trackById } from '@util/track-by';

export interface Mode {
  id: number;
  name: string;
  playerQuantity: number;
}

export const trackByMode = trackById;
