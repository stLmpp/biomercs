export interface Topic {
  id: number;
  name: string;
  idSubCategory: number;
  idScore?: number;
  idPlayer: number;
  views: number;
  pinned: boolean;
  lockedDate?: Date;
  idPlayerLastPost: number;
  playerPersonaNameLastPost: string;
  lastPostDate: Date;
  repliesCount: number;
  hasNewPosts: boolean;
}
