function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
module.exports = class extends Base {
  createAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.isPost) return false;
      const name = _this.post('name');
      const leader = _this.post('leader');
      const idgroup = yield _this.model('group').max('id');
      let group_id = Math.round(Math.random() * 10000);
      let existGroup = yield _this.model('group').where({ group_id: group_id }).select();
      while (existGroup.length > 0) {
        group_id = Math.round(Math.random() * 10000);
        existGroup = yield _this.model('group').where({ group_id: group_id }).select();
      }

      yield _this.model('group').add({ id: idgroup + 1, group_id: group_id, group_name: name, leader: leader });
      const data = yield _this.model('group').where({ id: idgroup + 1 }).select();
      if (data.length === 0) return false;

      const idrelationship = yield _this.model('relationship').max('id');
      yield _this.model('relationship').add({ id: idrelationship + 1, user_email: leader, group_id: data[0].group_id });
      return _this.success(data);
      // join group
    })();
  }

  getGroupAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) {
        return false;
      }
      const email = _this2.post('email');
      const data = yield _this2.model('relationship').where({ user_email: email, ['relationship.group_id']: ['!=', null] }).join({
        group: {
          join: 'left',
          on: ['group_id', 'group_id']
        }
      }).field('leader,relationship.group_id,group_name').select();
      return _this2.success(data);
    })();
  }

  getGroupMembersAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) return false;
      const group_id = _this3.post('group_id');
      const data = yield _this3.model('relationship').where({ group_id: group_id }).join({
        user: {
          join: 'left',
          on: ['user_email', 'user_email']
        }
      }).field('relationship.user_email,user_name').select();
      return _this3.success(data);
    })();
  }
};
//# sourceMappingURL=group.js.map