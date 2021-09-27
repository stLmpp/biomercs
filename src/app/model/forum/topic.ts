import { Post } from '@model/forum/post';
import { Pagination } from '@model/pagination';

export interface Topic {
  id: number;
  name: string;
  idSubCategory: number;
  idScore?: number;
  idPlayer: number;
  playerPersonaName: string;
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
  creationDate: Date;
}

export interface TopicWithPosts extends Topic {
  posts: Pagination<Post>;
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
