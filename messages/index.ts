export interface CommentJson {
  body: string;
  color?: string;
  size?: number;
  duration?: number;
  easing?: string;
}

export interface StampJson {
  path?: string;
  url?: string;
  duration?: number;
  easing?: string;
}

export interface Stamp {
  id: number;
  label: string;
  path: string;
  contentType: string;
}
