module.exports = class extends think.Controller {
  constructor(...arg) {
    super(...arg);
  }
  openAction() {
    console.log('ws open');
    return this.success();
  }
  closeAction() {
    console.log('ws close');
    return this.success();
  }
  addUserAction() {
    console.log('addUserAction ...');
    console.log(this.wsData); // this.req.websocketData, 'thinkjs'
    console.log(this.websocket); // this.req.websocket, websocket instance
    console.log(this.isWebsocket); // this.isMethod('WEBSOCKET'), true
    return this.success();
  }
};
//# sourceMappingURL=ws.js.map