import React, { useState, useContext, useEffect, ReactNode } from "react";
import { Dialog, Button } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import JsonEditor from "../JsonEditor";
import JsonContext from "../../context/jsonContext";
import { createTask, updateTask } from "../../utils/Api";

const useStyles = makeStyles((theme: Theme) => ({
  titleBar: {
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
    
  },
  
}));

type PropsType = {
  handleClose: () => void;
  open: boolean;
  writing: {
    title: string;
    btn: string
  };
};

const CustomDialog: React.FC<PropsType> = (props) => {
  const { handleClose, open,writing } = props;
  const classes = useStyles();

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      className={classes.dialogContainer}
    >
      <div className={classes.dialogContent}>
      <div className={classes.titleBar}>
        <p className="title">{writing.title}</p>
        <p className="icon-wrapper" onClick={handleClose}>
          <CloseIcon />
        </p>
      </div>
        {
          props.children
        }
      </div>
    </Dialog>
  );
};

export default CustomDialog;
