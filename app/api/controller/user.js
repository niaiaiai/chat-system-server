function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');

module.exports = class extends Base {
  infoAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const userInfo = yield _this.model('user').where({ id: _this.getLoginUserId() }).find();
      delete userInfo.password;
      return _this.json(userInfo);
    })();
  }

  /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
  avatarAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let avatarBase64 = _this2.post('avatar');
      if (think.isEmpty(avatarBase64)) {
        return _this2.fail('获取图片失败');
      }
      avatarBase64 = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
      const user_email = _this2.post('user_email');
      const that = _this2;

      const dataBuffer = new Buffer(avatarBase64, 'base64');
      const filename = '/static/avatar/' + user_email + '.jpg';
      fs.writeFileSync(think.ROOT_PATH + '/www' + filename, dataBuffer);
      // const filename = '/static/avatar/' + this.session('user_token').email + '.jpg';
      // const filename = '/static/avatar/1641084984@qq.com,' /*+ think.uuid(32)*/ + '.jpg';
      // const is = fs.createReadStream(avatarFile.path);
      // const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
      // is.pipe(os);

      // // save in database
      yield _this2.model('user').where({ user_email: user_email }).update({ avatar: 'http://47.107.155.139:8360' + filename + '?' + think.uuid(32) });

      return that.success({
        name: filename,
        fileUrl: 'http://47.107.155.139:8360' + filename + '?' + think.uuid(32)
      });
    })();
  }

  user_nameAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) return false;
      const user_email = _this3.post('user_email');
      const user_name = _this3.post('user_name');
      yield _this3.model('user').where({ user_email: user_email }).update({ user_name: user_name });
      return _this3.success(user_name);
    })();
  }

};
//# sourceMappingURL=user.js.map