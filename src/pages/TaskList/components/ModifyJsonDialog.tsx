import React, { useState, useContext, useEffect } from "react";
import { Button } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import JsonEditor from "../../../components/JsonEditor";
import JsonContext from "../../../context/jsonContext";
import { createTask, updateTask } from "../../../utils/Api";

const useStyles = makeStyles((theme: Theme) => ({
  dialogWrapper: {
    marginTop: theme.spacing(3),
    maxWidth: "1020px",
    "& .btn-wrapper": {
      textAlign: "right",
      marginTop: theme.spacing(3),
    },
  },
}));

export type InitJsonType = {
  name?: string;
      env_mode?: string;
      env_params?: string;
      suite?: string;
      _id?: string;
}

type PropsType = {
  handleClose: () => void;
  content: {
    action: string;
    row: InitJsonType
  };
  getListRequest: () => void;
};

const ModifyJsonDialog: React.FC<PropsType> = (props) => {
  const classes = useStyles();
  const { handleClose, content, getListRequest } = props;
  const {
    action,
    row: { name, env_mode, env_params, suite, _id },
  } = content;

  const { openSnackbar } = useContext(JsonContext);
  const [initJson, setInitJson] = useState<InitJsonType|null>(null);

  useEffect(() => {
    setInitJson({ name, env_mode, env_params, suite });
  }, [name, env_mode, env_params, suite]);

  const handleSave = async () => {
    if (action === "create") {
      try {
        let { msg, code } = await createTask(initJson);
        if (code === 200) {
          msg = "Successfully modified";
          openSnackbar("success", msg);
        } else {
          openSnackbar("error", "Error");
        }
      } catch (error) {
        console.log(error);
      } finally {
        getListRequest();
        handleClose();
      }
    } else if (action === "edit") {
      try {
        let { msg, code } = await updateTask(_id as string, initJson);
        if (code === 200) {
          msg = "Successfully modified";
          openSnackbar("success", msg);
        } else {
          openSnackbar("error", "Error");
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
    <>
      <div className={classes.dialogWrapper}>
        <JsonEditor initJson={initJson} updateJson={setInitJson} />
        <div className="btn-wrapper">
          <Button
            className="button"
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            {action === "create" ? "save" : "update"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ModifyJsonDialog;
