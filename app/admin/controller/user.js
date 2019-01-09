function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const page = _this.get('page') || 1;
      const size = _this.get('size') || 10;
      const name = _this.get('name') || '';

      const model = _this.model('user');
      const data = yield model.where({ username: ['like', `%${name}%`] }).order(['id DESC']).page(page, size).countSelect();

      return _this.success(data);
    })();
  }

  memberInfoAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) {
        return false;
      }
      const data = yield _this2.model('vip').join({ user: { join: 'inner', on: ['id', 'user_level_id'] } }).select();
      return _this2.success(data);
    })();
  }

  infoAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const id = _this3.get('id');
      const model = _this3.model('user');
      const data = yield model.where({ id: id }).find();

      return _this3.success(data);
    })();
  }

  storeAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.isPost) {
        return false;
      }

      const level_id = _this4.post('level_id');
      const id = _this4.post('id');

      const model = _this4.model('user');
      yield model.where({ id: id }).update({ user_level_id: level_id });
      let data = yield _this4.model('vip').where({ id: level_id }).find();
      return _this4.success(data);
    })();
  }

  destroyAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const id = _this5.post('id');
      yield _this5.model('user').where({ id: id }).limit(1).delete();
      // TODO 删除图片

      return _this5.success();
    })();
  }

  addAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      if (!_this6.isPost) {
        return false;
      }
      const id = yield _this6.model('user').max('id');
      const username = _this6.post('username');
      const level_id = _this6.post('level_id');
      let insertData = { id: id + 1, username: username, password: '', gender: 0, birthday: 0, register_time: 0, last_login_time: 0, last_login_ip: '', user_level_id: level_id, nickname: username, mobile: '', register_ip: '', avater: '', weixin_openid: '' };
      yield _this6.model('user').add(insertData);
      const data = yield _this6.model('vip').where({ id: level_id }).find();
      insertData.name = data.name;
      insertData.description = data.description;
      return _this6.success(insertData);
    })();
  }
};
//# sourceMappingURL=user.js.map