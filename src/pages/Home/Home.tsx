import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TaskList from "../TaskList";
import LogPage from "../Log";
import JsonContext from "../../context/jsonContext";
import CustomSnackbar from "../../components/CustomSnackbar";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    maxWidth: "1420px",
    margin: "0 auto",
    height: "100%",
    minWidth: "820px",
    overflowX: "auto",
  },
}));

const HomePage: React.FC = () => {
  const classes = useStyles();
  const [json, setJson] = useState({});

  const [config, setConfig] = useState({
    open: false,
    type: "success",
    alert: "",
  });

  const handleCloseSnack = () => {
    setConfig({
      open: false,
      type: "success",
      alert: "",
    });
  };

  const openSnackbar = (type: string, alert: string) => {
    setConfig({
      open: true,
      type,
      alert,
    });
  };

  return (
    <div className={classes.root}>
      <JsonContext.Provider value={{ json, setJson, openSnackbar }}>
        <Router>
          <Route exact path="/" component={TaskList} />
          <Route exact path="/log/:id" component={LogPage} />
        </Router>
        <CustomSnackbar {...config} handleClose={handleCloseSnack} />
      </JsonContext.Provider>
    </div>
  );
};

export default HomePage;
