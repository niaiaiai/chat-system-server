function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  loAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const username = _this.post('userName');
      const password = _this.post('password');

      const admin = yield _this.model('admin').where({ username: username }).find();
      if (think.isEmpty(admin)) {
        return _this.success();
      }

      if (password !== admin.password) {
        return _this.success();
      }

      // 更新登录信息
      yield _this.model('admin').where({ id: admin.id }).update({
        last_login_time: parseInt(Date.now() / 1000),
        last_login_ip: _this.ctx.ip
      });

      const TokenSerivce = _this.service('token', 'admin');
      const sessionKey = yield TokenSerivce.create({
        user_id: admin.id
      });

      if (think.isEmpty(sessionKey)) {
        return '';
      }

      const userInfo = {
        id: admin.id,
        username: admin.username,
        avatar: admin.avatar,
        admin_role_id: admin.admin_role_id
      };

      return _this.success({ code: 200, token: username });
    })();
  }

  infoAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const token = _this2.get('token');
      return _this2.success({ code: 200, access: [token, 'admin'], avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png', user_id: '14138', user_name: token });
    })();
  }
};
//# sourceMappingURL=auth.js.map