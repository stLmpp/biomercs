export interface PostContentOpInsertMention {
  index: string;
  denotationChar: string;
  id: string;
  value: string;
  link: string;
}

export interface PostContentOpInsert {
  video?: string;
  mention?: PostContentOpInsertMention;
}

export interface PostContentOpAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  blockquote?: boolean;
  'code-block'?: boolean;
  list?: string;
  indent?: number;
  align?: string;
  direction?: string;
  size?: string;
  header?: number;
  color?: string;
  background?: string;
  font?: string;
  link?: string;
}

export interface PostContentOp {
  insert: PostContentOpInsert | string;
  attributes?: PostContentOpAttributes;
}

export interface PostContent {
  ops: PostContentOp[];
}
