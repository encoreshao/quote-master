declare module "lodash/debounce";

type PlainObjectType = {
  [index: string]: any;
};

type IssueType = {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  labels: string[];
  author: {
    id: number;
    username: string;
    name: string;
    avatar_url: string;
    web_url: string;
  };
  assignee: {
    id: number;
    username: string;
    name: string;
    avatar_url: string;
    web_url: string;
  };
  user_notes_count: number;
  upvotes: number;
  downvotes: number;
  due_date: string;
  web_url: string;
  closed_at: string;
};

type ProjectType = {
  id: number;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: string;
  tag_list: string[];
  topic: string[];
  description: string;
  web_url: string;
  readme_url: string;
  avatar_url: string;
  last_activity_at: string;
  open_issues_count: number;
  star_count: number;
  namespace: {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
    parent_id: number;
    avatar_url: string;
    web_url: string;
  };
};

type UserType = {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  web_url: string;
};
