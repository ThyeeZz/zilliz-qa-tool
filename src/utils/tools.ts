import { ListItemType } from "../types";

interface SortParams {
  arr: ListItemType[];
  key: "name" | "created_time" | "last_executed_time" | "status";
  keyType: "string" | "date"|'number';
  isAsc: string;
}

export const customSort = (params: SortParams) => {
  const { arr, key, keyType, isAsc } = params;
  if (keyType === "string") {
    arr.sort((x, y) => {
      return isAsc === "asc"
        ? y[key]! >= x[key]!
          ? 1
          : -1
        : y[key]! >x[key]!
        ? -1
        : 1;
    });
  } else if(keyType==='date'){
    arr.sort((x, y) => {
      return isAsc === "asc"
        ? new Date(y[key]!).getTime() - new Date(x[key]!).getTime()
        : new Date(x[key]!).getTime() - new Date(y[key]!).getTime();
    });
  }else if(keyType==='number'){
    arr.sort((x, y) => {
      return isAsc === "asc"
        ? Number(y[key]) - Number(x[key])
        : Number(x[key]) - Number(y[key])
    });
  }
  console.log(arr)
};
