const model = require('think-model');
const cache = require('think-cache');
const websocket = require('think-websocket');
const session = require('think-session');

module.exports = [model(think.app), websocket(think.app), cache, session];
//# sourceMappingURL=extend.js.map