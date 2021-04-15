import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

type Data = {
  name: string;
  created_time: string;
  last_executed_time: string;
  status: string;
  operations: string;
};
type Order = "asc" | "desc";

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const classes = useStyles();
  const { order, orderBy, onRequestSort } = props;
  const headCells: HeadCell[] = [
    {
      id: "name",
      label: "name",
      disablePadding: false,
      numeric: false,
    },
    {
      id: "created_time",
      label: "Created Time",
      disablePadding: false,
      numeric: false,
    },
    {
      id: "last_executed_time",
      label: "Last Executed Time",
      disablePadding: false,
      numeric: false,
    },
    {
      id: "status",
      label: "Status",
      disablePadding: false,
      numeric: false,
    },
    {
      id: "operations",
      label: "Operations",
      disablePadding: false,
      numeric: false,
    },
  ];
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  const orderByList = ["created_time", "last_executed_time"];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "center"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {orderByList.includes(headCell.id) ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
