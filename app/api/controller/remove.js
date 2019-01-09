function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
module.exports = class extends Base {
  removeFriendAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.isPost) return false;
      const user_email = _this.post('user_email');
      const friend_email = _this.post('friend_email');
      yield _this.model('relationship').where({ user_email: user_email, friend_email: friend_email }).delete();
      yield _this.model('relationship').where({ user_email: friend_email, friend_email: user_email }).delete();
      return _this.success(friend_email);
    })();
  }

  leaveGroupAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) return false;
      const user_email = _this2.post('user_email');
      const group_id = _this2.post('group_id');
      yield _this2.model('relationship').where({ user_email: user_email, group_id: group_id }).delete();
      return _this2.success(group_id);
    })();
  }

};
//# sourceMappingURL=remove.js.map