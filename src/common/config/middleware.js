const path = require('path');
const isDev = think.env === 'development';
const kcors = require('kcors');

module.exports = [
  {
    handle: kcors, // 处理跨域
    options: {
      origin: function(ctx) {
        return 'http://localhost:9080'
      },
      allowMethods: ['GET','HEAD','PUT','POST','DELETE','PATCH','OPTIONS'],
      allowHeaders: ['content-type'],
      credentials: true
    }
  },
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: 'router',
    options: {
      defaultModule: 'admin',
      defaultController: 'auth',
      defaultAction: 'login'
    }
  },
  'logic',
  'controller'
];
