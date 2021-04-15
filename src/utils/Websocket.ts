const baseUrl = "ws://172.16.50.20:8000";

class LogSocket {
  ws: WebSocket = null!;
  onmessageCb: (params: any) => void;
  constructor(id: string, onmessageCb: (params: any) => void) {
    this.ws = new WebSocket(`${baseUrl}/ws/${id}`);
    this.onmessageCb = onmessageCb;
    this.init()
  }
  init = () => {
    this.ws.onopen = this.onopen;
    this.ws.onclose = this.onclose;
    this.ws.onmessage = this.onmessage;
    this.ws.onerror = this.onerror;
  };
  onopen = (evt: any) => {
    console.log("connection open");
    this.ws.send("Hello WebSockets!");
  };
  onmessage = (evt: any) => {
    console.log(evt.data)
    this.onmessageCb(evt.data);
  };
  onclose = () => {
    console.log("Connection closed.");
    this.ws.close();
  };
  onerror = (evt: any) => {
    console.log("connection error" + evt);
  };
}

export default LogSocket;
