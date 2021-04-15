export type ListItemType = {
  name: string;
  last_executed_time: string;
  env_mode: string;
  env_params: {
    host: string;
    port: string;
  };
  _id: string;
  suite: object;
  _cls: string;
  created_time?: string;
  description: string | null;
  status: string;
  statusCn?:string;
};

export type TaskAddType = {
  job: string;
  id: string;
};
export interface createTaskI {
  msg: string;
  code: number;
  data: TaskAddType;
}
export interface TaskListResponseI {
  msg: string;
  code: number;
  data: ListItemType[];
}
export interface TaskItemResponseI {
  msg: string;
  code: number;
  data: ListItemType;
}

export type TaskLsitType = ListItemType[];

export type ContentType = {
  name: string;
  env_mode: string;
  env_params: {
    host: string;
    port: string;
  };
  _id: string;
  suite: object;
};

export interface ExecuteTaskI {
  code: number;
  data: {
    job: string;
  };
  msg: "string";
}
