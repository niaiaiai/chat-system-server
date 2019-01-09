const fileCache = require('think-cache-file');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const database = require('./database.js');
const socketio = require('think-websocket-socket.io');
// const redisCache = require('think-cache-redis');
const fileSession = require('think-session-file');
const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
};
// exports.cache = {
//   type: 'redis',
//   common: {
//     timeout: 24 * 3600 * 1000 // millisecond
//   },
//   redis: {
//     handle: redisCache,
//     port: 8360,
//     host: '127.0.0.1',
//     password: ''
//   }
// }
/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: database
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};

exports.websocket = {
  type: 'socketio',
  common: {
    // common config
  },
  socketio: {
    handle: socketio,
    allowHeaters: ['content-type'],
    allowCredentials: true,
    allowMethods: ['GET','HEAD','PUT','POST','DELETE','PATCH','OPTIONS'],
    allowOrigin: 'localhost:9080',  // 默认所有的域名都允许访问
    path: '/socket.io',             // 默认 '/socket.io'
    adapter: null,                  // 默认无 adapter
    messages: [{
      open: '/api/websocket/open',       // 建立连接时处理对应到 websocket Controller 下的 open Action
      // storeSocket: '/api/websocket/storeSocket', // 得知连接的用户的email
      close: '/api/websocket/close',     // 关闭连接时处理的 Action
      addVerify: '/api/websocket/addVerify', // 发送好友验证
      addFriend: '/api/websocket/addFriend', // 同意添加好友
      addGroup: '/api/websocket/addGroup', // 同意对方加入群
      inviteToGroup: '/api/websocket/inviteToGroup', // 邀请好友进入群
      acceptInviteAddToGroupLeader: '/api/websocket/acceptInviteAddToGroupLeader', // 群主接受邀请加入群
      acceptInviteAddToGroup: '/api/websocket/acceptInviteAddToGroup', // 被邀请人接受邀请加入群
      createGroupJoin: '/api/websocket/createGroupJoin', // 创建群后加入聊天室
      removeGroup: '/api/websocket/removeGroup', // 解散群
      leaveGroup: '/api/websocket/leaveGroup', // 离开群
      chat: '/api/websocket/chat', // 聊天
    }]
  }
};

exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs',
      keys: ['signature key'],
      signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
}
