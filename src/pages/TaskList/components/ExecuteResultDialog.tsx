import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3,0),
    '& p':{
      padding: theme.spacing(1,0),
      fontSize: '14px',
      lineHeight: '22px'
    }
  },
}));

type ResultType = {
  code: number;
  data: object;
  msg: string;
};
const ExecuteResultLayout: React.FC<ResultType> = (props) => {
  const classes = useStyles();
  const { code, data, msg } = props;
  return (
    <div className={classes.root}>
      <p>code: {code}</p>
      <p>data: {JSON.stringify(data)}</p>
      <p>msg: {msg}</p>
    </div>
  );
};

export default ExecuteResultLayout;
