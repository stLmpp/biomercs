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
  idLastPost: number;
  nameLastPost: string;
}

export interface TopicRecent {
  id: number;
  name: string;
  idCategory: number;
  nameSubCategory: string;
  idSubCategory: number;
  idPlayer: number;
  playerPersonaName: string;
  idPost: number;
  postName: string;
  postDate: Date;
}
