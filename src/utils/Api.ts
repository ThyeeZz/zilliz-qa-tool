import httpRequest from "./Axios";
import {
  createTaskI,
  TaskListResponseI,
  TaskItemResponseI,
  ExecuteTaskI,
} from "../types";

export const createTask = async (params: any): Promise<createTaskI> => {
  return httpRequest.post("tasks/add", params);
};

export const updateTask = async (
  id: string,
  params: any
): Promise<createTaskI> => {
  return httpRequest.post(`tasks/update/${id}`, params);
};

export const getTaskItem = (id: string): Promise<TaskItemResponseI> => {
  return httpRequest.get("tasks/" + id);
};

export const getTaskList = (): Promise<TaskListResponseI> => {
  return httpRequest.get("tasks");
};

export const executeTask = (id: string): Promise<ExecuteTaskI> => {
  return httpRequest.post("tasks/reschedule/" + id);
};

