function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {

  FriendAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.isPost) return false;
      const searchValue = _this.post('searchValue');
      const user_email = _this.post('user_email');
      let data = [];
      if (searchValue.trim() === '') {
        data = yield _this.model('relationship').where({ ['relationship.user_email']: user_email, friend_email: ['!=', null] }).join({
          user: {
            join: 'left',
            on: ['friend_email', 'user_email']
          }
        }).field('friend_email,user_name,avatar').select();
      } else {
        if (searchValue.includes('@')) {
          data = yield _this.model('relationship').where({ ['relationship.user_email']: user_email, friend_email: searchValue }).join({
            user: {
              join: 'left',
              on: ['friend_email', 'user_email']
            }
          }).field('friend_email,user_name,avatar').select();
        } else {
          data = yield _this.model('relationship').where({ ['relationship.user_email']: user_email, ['user.user_name']: ['like', `%${searchValue}%`] }).join({
            user: {
              join: 'left',
              on: ['friend_email', 'user_email']
            }
          }).field('friend_email,user_name,avatar').select();
        }
      }
      return _this.success(data);
    })();
  }

  UserAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) return false;
      const searchValue = _this2.post('value');
      let data = [];
      if (searchValue.includes('@')) {
        // 搜索邮箱(账号)
        data = yield _this2.model('user').where({ user_email: searchValue }).select();
      } else {
        // 搜索名字(模糊查询)
        data = yield _this2.model('user').where({ user_name: ['like', `%${searchValue}%`] }).select();
      }
      return _this2.success(data);
    })();
  }

  addGroupSearchAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) return false;
      const searchValue = _this3.post('value');
      let data = yield _this3.model('group').where({ group_id: searchValue }).select();
      if (data.length === 0) data = yield _this3.model('group').where({ group_name: ['like', `%${searchValue}%`] }).select();
      return _this3.success(data);
    })();
  }
};
//# sourceMappingURL=search.js.map