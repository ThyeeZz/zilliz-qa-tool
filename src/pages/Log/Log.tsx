import React, { useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import LogSocket from "../../utils/Websocket";
import { executeTask } from "../../utils/Api";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    minHeight: "600px",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    "& .title": {
      fontSize: "22px",
      lineHeight: "30px",
      fontWeight: "bold",
    },
  },
  titleBar: {
    fontSize: "22px",
    lineHeight: "30px",
    padding: theme.spacing(1, 0),
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  btnWrapper: {
    margin: theme.spacing(3, 0),
  },
  response: {
    flex: 1,
    padding: theme.spacing(2, 2),
    marginBottom: theme.spacing(2),
    boxShadow: "5px 5px 10px #eee",
    border: "1px solid #eee",
    "& .response": {
      fontSize: "16px",
      lineHeight: "24px",
      padding: theme.spacing(2, 0),
    },
  },
  log: {
    flex: 1,
    maxHeight: "400px",
    padding: theme.spacing(2, 2),
    border: "1px solid #eee",
    boxShadow: "5px 5px 10px #eee",
    "& .log": {
      fontSize: "16px",
      lineHeight: "24px",
      padding: theme.spacing(2, 0),
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
      "& span": {
        padding: theme.spacing(0.5, 0),
      },
    },
  },
}));

let socket: LogSocket;

const LogPage: React.FC<any> = (props) => {
  const classes = useStyles();
  const status = props.location.state.status;
  const [log, setLog] = useState([]);
  const [response, setResponse] = useState("");

  const { id } = useParams<{ id: string }>();

  const updateLog = (data: any) => {
    setLog(log.concat(data));
  };

  const executeTaskRequest = async () => {
    try {
      const { code, msg, data } = await executeTask(id);
      setResponse(
        JSON.stringify({
          code,
          data,
          msg,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket = new LogSocket(id, updateLog);

    return () => {
      socket.onclose();
    };
  }, [id]);

  return (
    <section className={classes.root}>
      <p className={classes.titleBar}>Zilliz QA Test Tool</p>
      <div className={classes.btnWrapper}>
        <Button
          variant="contained"
          color="primary"
          onClick={executeTaskRequest}
          disabled={status === '1'}
        >
          Execute
        </Button>
      </div>
      <div className={classes.response}>
        <p className="title">Response</p>
        <p className="response">{response}</p>
      </div>
      <div className={classes.log}>
        <p className="title">log</p>
        <p className="log">
          {log.map((item, index) => {
            return <span key={index}>{item}</span>;
          })}
        </p>
      </div>
    </section>
  );
};

export default LogPage;
