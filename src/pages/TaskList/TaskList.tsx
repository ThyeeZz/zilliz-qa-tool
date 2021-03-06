import React, { useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from "@material-ui/core";
import TablePaginationActions from "../../components/TablePaginationActions";
import CustomDialog from "../../components/CustomDialog/indext";
import { getTaskList, executeTask } from "../../utils/Api";
import { ListItemType } from "../../types/index";
import Moment from "moment";
import ModifyJsonDialog from "./components/ModifyJsonDialog";
import ExecuteResultDialog from "./components/ExecuteResultDialog";
import EnhancedTableHead from "./components/EnhancedTableHead";
import { customSort } from "../../utils/tools";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    display: "flex",
    height: "100%",
    padding: theme.spacing(1, 0),
    boxSizing: "border-box",
    flexDirection: "column",
    "& .pagination": {
      border: "1px solid #eee",
      background: "#fff",
      width: "100%",
    },
    "& .bg-gray": {
      padding: theme.spacing(3, 3),
      background: "#eee",
      display: "flex",
      flexDirection: "column",
      marginTop: theme.spacing(3),
    },
  },
  titleBar: {
    marginBottom: theme.spacing(3),
    fontSize: "22px",
    lineHeight: "30px",
    padding: theme.spacing(1, 0),
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  table: {
    marginTop: theme.spacing(3),
    border: "1px solid #eee",
    minWidth: "820px",
  },
  tableContainer: {
    boxShadow: "none",

    "& .MuiPaper-elevation1": {
      boxShadow: "none",
    },
  },
}));

type StatusOptions = {
  [key: string]: string;
};
// interface Data {
//   calories: number;
//   carbs: number;
//   fat: number;
//   name: string;
//   protein: number;
// }

const TaskList: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openType, setOpenType] = useState({
    open: false,
    type: "modify",
  });
  const [content, setContent] = useState({
    action: "",
    row: {},
  });
  const [writing, setWriting] = useState({
    title: "Title",
    btn: "Save",
  });
  const [result, setResult] = useState({
    code: 0,
    data: {},
    msg: "",
  });
  const [rows, setRows] = useState<ListItemType[]>([]);
  const statusOptions: StatusOptions = {
    "0": "NEW",
    "1": "RUNING",
    "2": "EXECUTED",
    "-1": "UNKNOWN",
  };
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState("created_time");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any
  ) => {
    let isAsc;
    if (orderBy === property) {
      setOrder(order === "asc" ? "desc" : "asc");
      isAsc = order === "asc" ? "desc" : "asc";
    } else {
      setOrder("asc");
      isAsc = "asc";
    }
    setOrderBy(property);

    switch (property) {
      case "name": {
        customSort({
          arr: rows,
          key: "name",
          keyType: "string",
          isAsc,
        });
        return;
      }
      case "created_time": {
        customSort({
          arr: rows,
          key: "created_time",
          keyType: "date",
          isAsc,
        });
        return;
      }
      case "last_executed_time": {
        customSort({
          arr: rows,
          key: "last_executed_time",
          keyType: "date",
          isAsc,
        });
        return;
      }
      case "status": {
        customSort({
          arr: rows,
          key: "status",
          keyType: "number",
          isAsc,
        });
        return;
      }
      default:
        return;
    }
  };

  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleClose = () => {
    setOpenType({
      open: false,
      type: "",
    });
  };

  const handleGetDetail = async (row: ListItemType) => {
    const { _id } = row;
    history.push({ pathname: `/log/${_id}`, state: { status: row.status } });
  };

  const executeTaskRequest = async (row: ListItemType) => {
    const { _id } = row;
    try {
      const { code, msg, data } = await executeTask(_id);
      setResult({ code, data, msg });
    } catch (error) {
      console.log(error);
    } finally {
      getListRequest();
      setWriting({
        title: "Execute Result",
        btn: "",
      });
      setOpenType({
        open: true,
        type: "notify",
      });
    }
  };

  const hanldeCreateOrEditTask = (action: string, row: object) => {
    if (action === "edit") {
      setContent({
        action: "edit",
        row,
      });
      setWriting({
        title: "Edit Task",
        btn: "Update",
      });
    } else {
      setContent({
        action: "create",
        row: {},
      });
      setWriting({
        title: "Create Task",
        btn: "Save",
      });
    }
    setOpenType({
      open: true,
      type: "modify",
    });
  };

  const getListRequest = async () => {
    try {
      const { data } = await getTaskList();
      // data.sort(
      //   (x, y) =>
      //     new Date(y.created_time!).getTime() -
      //     new Date(x.created_time!).getTime()
      // );
      setRows(
        data.map((item) => {
          let { last_executed_time, created_time, status } = item;
          created_time = Moment(created_time).format("YYYY-MM-DD HH:mm");
          last_executed_time = Moment(last_executed_time).format(
            "YYYY-MM-DD HH:mm"
          );
          status = status || "-1";
          const statusCn = statusOptions[status];
          return { ...item, last_executed_time, created_time, statusCn,status };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListRequest();
    const timer = setInterval(getListRequest, 60000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <section className={classes.root}>
      <p className={classes.titleBar}>Zilliz QA Test Tool</p>
      <div className="butn-wrapper">
        <Button
          variant="contained"
          color="primary"
          onClick={() => hanldeCreateOrEditTask("create", {})}
        >
          Create Task
        </Button>
      </div>
      <div className="bg-gray">
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.created_time || ""}</TableCell>
                  <TableCell align="center">{row.last_executed_time}</TableCell>
                  <TableCell align="center">{row.statusCn}</TableCell>

                  <TableCell
                    scope="row"
                    align="center"
                    children={
                      <>
                        <Button
                          color="primary"
                          onClick={() => hanldeCreateOrEditTask("edit", row)}
                          disabled={row.status === "1"}
                        >
                          Edit
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => handleGetDetail(row)}
                        >
                          Detail
                        </Button>
                        <Button
                          color="primary"
                          disabled={row.status === "1"}
                          onClick={() => executeTaskRequest(row)}
                        >
                          Execute
                        </Button>
                      </>
                    }
                  ></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className="pagination"
          component="div"
          rowsPerPageOptions={[]}
          colSpan={3}
          count={rows.length}
          rowsPerPage={10}
          page={page}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>
      <CustomDialog
        open={openType.open}
        handleClose={handleClose}
        writing={writing}
      >
        {openType.type === "notify" ? (
          <ExecuteResultDialog {...result} />
        ) : openType.type === "modify" ? (
          <ModifyJsonDialog
            handleClose={handleClose}
            content={content}
            getListRequest={getListRequest}
          />
        ) : (
          ""
        )}
      </CustomDialog>
    </section>
  );
};

export default TaskList;
