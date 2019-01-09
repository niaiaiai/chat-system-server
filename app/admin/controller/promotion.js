function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const data = yield _this.model('coupon').select();
      return _this.success(data);
    })();
  }

  // async discountAction() {
  //   const data = await this.model()
  // }

  addAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) {
        return false;
      }
      const id = yield _this2.model('coupon').max('id');
      const name = _this2.post('name');
      const type_money = _this2.post('type_money');
      const send_start_date = _this2.post('send_start_date');
      let insertData = { id: id + 1, name: name, type_money: type_money, send_type: id + 1, min_amount: 0, max_amount: 0, send_start_date: send_start_date, send_end_date: 0, use_start_date: 0, use_end_date: 0, min_goods_amount: 0 };
      yield _this2.model('coupon').add(insertData);
      return _this2.success(insertData);
    })();
  }

  editAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) {
        return false;
      }
      const id = _this3.post('id');
      const name = _this3.post('name');
      const type_money = _this3.post('type_money');
      const send_start_date = _this3.post('send_start_date');
      yield _this3.model('coupon').where({ id: id }).update({ name: name, type_money: type_money, send_start_date: send_start_date });
      return _this3.success();
    })();
  }

  destroyAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.isPost) {
        return false;
      }
      const id = _this4.post('id');
      yield _this4.model('coupon').where({ id: id }).limit(1).delete();
      return _this4.success();
    })();
  }
};
//# sourceMappingURL=promotion.js.map