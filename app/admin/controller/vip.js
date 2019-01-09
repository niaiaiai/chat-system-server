function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const data = yield _this.model('vip').select();
      return _this.success(data);
    })();
  }

  editAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) {
        return false;
      }
      const id = _this2.post('id');
      const name = _this2.post('name');
      const description = _this2.post('description');
      const data = yield _this2.model('vip').where({ id: id }).update({ name: name, description: description });
      return _this2.success();
    })();
  }

  addAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) {
        return false;
      }
      const id = yield _this3.model('vip').max('id');
      const name = _this3.post('name');
      const description = _this3.post('description');
      yield _this3.model('vip').add({ id: id + 1, name: name, description: description });
      return _this3.success({ id: id + 1, name: name, description: description });
    })();
  }

  destroyAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.isPost) {
        return false;
      }
      const id = _this4.post('id');
      yield _this4.model('vip').where({ id: id }).limit(1).delete();
      return _this4.success();
    })();
  }
};
//# sourceMappingURL=vip.js.map