import React from "react";
import HomePage from "./pages/Home";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useSTyles = makeStyles((theme: Theme) => ({
  app: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
}));

function App() {
  const classes = useSTyles();
  return (
    <div className={classes.app}>
      <HomePage />
    </div>
  );
}

export default App;
