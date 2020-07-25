/*export interface Environment {
  name: string;
  description: string;
  base_imageid: string;
  base_technology_details: string;
  tags: string[];
  amiid: string;
  category: string;
  uid: number;
  eval_code: string;
  git_url: string;
}*/

export interface Environment {
  name: string;
  description: string;
  base_imageid: string;
  instanceid: string;
  id: number;
  commited:boolean;
  amiid: string;
  pwd: string;
  tags: any[];
  category: string;
  git_url: string;
  evalcode: string;
}
