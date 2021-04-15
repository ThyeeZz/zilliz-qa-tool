import {createContext} from 'react';

type JsonContextType = {
  json: object;
  setJson: React.Dispatch<React.SetStateAction<{}>>
  openSnackbar: (type:string,alert:string)=>void
}

const JsonContext = createContext<JsonContextType>({
  json: {},
  setJson: ()=>{},
  openSnackbar: ()=>{}
})

export default JsonContext