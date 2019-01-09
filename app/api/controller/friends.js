function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  getFriends(user_email) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const data = yield _this.model('relationship').where({ ['relationship.user_email']: user_email, friend_email: ['!=', null] }).join({
        user: {
          join: 'left',
          on: ['friend_email', 'user_email']
        }
      }).field('friend_email,user_name,avatar').select();
      return data;
    })();
  }

  getFriendsAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) {
        return false;
      }
      const user_email = _this2.post('email');
      const data = yield _this2.getFriends(user_email);
      // const data = await this.model('relationship').where({['relationship.user_email']:email,friend_email:['!=',null]}).join({
      //   user:{
      //     join: 'left',
      //     on: ['friend_email','user_email']
      //   }
      // }).field('friend_email,user_name,avatar').select()
      return _this2.success(data);
    })();
  }
};
//# sourceMappingURL=friends.js.map