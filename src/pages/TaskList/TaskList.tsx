import React, { useContext, useEffect, useState } from "react";
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
import JsonContext from "../../context/jsonContext";
import Moment from "moment";

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
  [key: number]: string;
};

const TaskList: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { openSnackbar } = useContext(JsonContext);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = useState("");
  const [content, setContent] = useState({});
  const [rows, setRows] = useState<ListItemType[]>([]);
  const statusOptions: StatusOptions = {
    0: "已创建",
    1: "执行中",
    2: "执行完成",
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
    setOpen("");
  };

  const handleGetDetail = async (row: ListItemType) => {
    const { _id } = row;
    history.push(`/log/${_id}`);
  };

  const executeTaskRequest = async (row: ListItemType) => {
    const { _id } = row;
    try {
      const { code,msg,data } = await executeTask(_id);
      if (code === 200) {
        openSnackbar("success", JSON.stringify({code,data,msg}));
      }else{
        openSnackbar("error", JSON.stringify({code,data,msg}));

      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTask = (val: string, row: ListItemType) => {
    setContent(row);
    setOpen(val);
  };
  const handleCreateTask = (val: string, {}) => {
    setContent({});
    setOpen(val);
  };

  const getListRequest = async () => {
    try {
      const { data } = await getTaskList();
      if (data.length > 1) {
        data.sort(
          (x, y) =>
            new Date(y.created_time!).getTime() -
            new Date(x.created_time!).getTime()
        );
      }
      setRows(
        data.map((item) => {
          let { last_executed_time, created_time, status } = item;
          created_time = Moment(created_time).format("YYYY-MM-DD HH:mm");
          last_executed_time = Moment(last_executed_time).format(
            "YYYY-MM-DD HH:mm"
          );
          const statusCn = statusOptions[status];
          return { ...item, last_executed_time, created_time, statusCn };
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
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  return (
    <section className={classes.root}>
      <p className={classes.titleBar}>Zilliz QA Test Tool</p>
      <div className="butn-wrapper">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleCreateTask("Create", {})}
        >
          Create Task
        </Button>
      </div>
      <div className="bg-gray">
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Create time</TableCell>
                <TableCell align="center">Last execute time</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Options</TableCell>
              </TableRow>
            </TableHead>
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
                  <TableCell align="center">{row.statusCn || "未知"}</TableCell>

                  <TableCell
                    scope="row"
                    align="center"
                    children={
                      <>
                        <Button
                          color="primary"
                          onClick={() => handleEditTask("Edit", row)}
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
        open={open}
        handleClose={handleClose}
        content={content}
        getListRequest={getListRequest}
      />
    </section>
  );
};

export default TaskList;
