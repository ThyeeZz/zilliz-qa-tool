import React, { useRef, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import JSONEditor, { JSONEditorMode } from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";
import { InitJsonType } from "../../pages/TaskList/components/ModifyJsonDialog";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "800px",
    height: "400px",
    overflow: "auto",
  },
}));

type PropsType = {
  initJson: InitJsonType | null;
  updateJson: React.Dispatch<React.SetStateAction<any>>;
};

let editor = null;

const JsonEditor: React.FC<PropsType> = (props) => {
  const classes = useStyles();
  const { initJson, updateJson } = props;

  const container = useRef(null!);

  useEffect(() => {
    const options = {
      onChangeText: (initJson: any) => {
        updateJson(initJson);
      },
      mode: "code" as JSONEditorMode,
    };
    if (initJson) {
      editor = new JSONEditor(container.current, options);
      editor.set(initJson);
    }

    return () => {
      editor = null;
    };
  }, [initJson]);

  return <div className={classes.container} ref={container}></div>;
};

export default JsonEditor;
