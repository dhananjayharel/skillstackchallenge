export interface Environment {
  name: string;
  description: string;
  base_imageid: string;
  instanceid: string;
  id: number;
  commited:boolean;
  amiid: string;
  pwd: string;
  git_url: string;
}