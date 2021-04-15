import React, { useState, useContext, useEffect } from "react";
import { Dialog, Button } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import JsonEditor from "../JsonEditor";
import JsonContext from "../../context/jsonContext";
import { createTask, updateTask } from "../../utils/Api";

const useStyles = makeStyles((theme: Theme) => ({
  dialogContainer: {
    mwidth: "1020px",
    border: "1px solid red",
    "& .MuiPaper-root": {
      maxWidth: "1420px",
    },
  },
  dialogContent: {
    width: "1020px",
    padding: theme.spacing(2, 2),
    "& .dialog-title-bar": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(1, 0),
      "& .title": {
        fontSize: "18px",
        lineHeight: "24px",
      },
      "& .icon-wrapper": {
        width: "24px",
        height: "24px",
        fontSize: "24px",
        cursor: "pointer",
      },
    },
  },
  dialogWrapper: {
    marginTop: theme.spacing(3),
    maxWidth: "1020px",
    "& .btn-wrapper": {
      textAlign: "right",
      marginTop: theme.spacing(3),
    },
  },
}));

type PropsType = {
  handleClose: () => void;
  open: string;
  content: any;
  getListRequest: () => void;
};

const CustomDialog: React.FC<PropsType> = (props) => {
  const { handleClose, open, content, getListRequest } = props;
  const { name, env_mode, env_params, suite, _id } = content;
  const classes = useStyles();
  const { openSnackbar } = useContext(JsonContext);

  const [initJson, setInitJson] = useState({});

  useEffect(() => {
    setInitJson({ name, env_mode, env_params, suite });
  }, [name, env_mode, env_params, suite]);

  const handleCreateOrUpdate = async () => {
    if (open === "Create") {
      try {
        let { msg, code } = await createTask(initJson);
        if (code === 200) {
          msg = "Successfully modified";
          openSnackbar("success", msg);
        } else {
          openSnackbar("error", 'Error');
        }
      } catch (error) {
        console.log(error);
      } finally {
        getListRequest();
        handleClose();
      }
    } else if (open === "Edit") {
      try {
        let { msg, code } = await updateTask(_id, initJson);
        if (code === 200) {
          msg = "Successfully modified";
          openSnackbar("success", msg);
        } else {
          openSnackbar("error", 'Error');
        }
      } catch (error) {
        console.log(error);
      } finally {
        getListRequest();
        handleClose();
      }
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={!!open}
      className={classes.dialogContainer}
    >
      <div className={classes.dialogContent}>
        <div className="dialog-title-bar">
          <p className="title">{open} Task</p>
          <p className="icon-wrapper" onClick={handleClose}>
            <CloseIcon />
          </p>
        </div>

        <div className={classes.dialogWrapper}>
          <JsonEditor initJson={initJson} updateJson={setInitJson} />
          <div className="btn-wrapper">
            <Button
              className="button"
              variant="contained"
              color="primary"
              onClick={handleCreateOrUpdate}
            >
              {open === "Create" ? "save" : "update"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CustomDialog;
