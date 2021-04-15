import React from "react";
import { Snackbar } from "@material-ui/core/";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  dialogContainer: {
    mwidth: "1020px",
    border: "1px solid red",
    "& .MuiPaper-root": {
      maxWidth: "1420px",
    },
  },
  alert: {
    padding: theme.spacing(1, 2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    lineHeight: "24px",
    borderRadius: "4px",
    "&.success": {
      background: "#4caf50",
      color: "#fff",
    },
    "&.error": {
      background: "#f44336",
      color: "#fff",
    },
    "&.warning": {
      background: "##ff9800",
      color: "#fff",
    },
    "&.infomation": {
      background: "##2196f3",
      color: "#fff",
    },
    "& .content": {
      paddingd: theme.spacing(1, 0),
      marginRight: theme.spacing(3),
    },
    "& .icon-wrapper": {
      width: "24px",
      height: "24px",
      fontSize: "24px",
      cursor: "pointer",
    },
  },
}));

type SnackebarType = {
  alert: string;
  type: string;
  open: boolean;
  handleClose: ()=>void
};

const CustomSnackbar: React.FC<SnackebarType> = (props) => {
  let { open, type, alert,handleClose} = props;

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={type}>
          {alert}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomSnackbar;

type PropsType = {
  onClose: (event: React.SyntheticEvent<any, Event>, reason: string) => void;
  severity: string;
};

const Alert: React.FC<PropsType> = (props) => {
  const { onClose, severity } = props;
  const classes = useStyles();
  return (
    <div className={`${classes.alert} ${severity}`}>
      <p className="content">{props.children}</p>
      <p className="icon-wrapper" onClick={(e) => onClose(e, "close")}>
        <CloseIcon />
      </p>
    </div>
  );
};
