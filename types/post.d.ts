export interface IPost {
  title: string;
  description: string;
  delta: string;
  author?: string;
  tags?: string[];
}

export type IPostStatus = "DRAFT" | "PUBLISHED";
