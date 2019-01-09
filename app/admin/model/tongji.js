function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class extends think.Model {
  getStore(dateRange) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const data = yield _this.model('order').where({ add_time: ['between', dateRange[0], dateRange[1]] }).join({
        order_goods: {
          join: 'inner',
          on: ['order_sn', 'order_id']
        },
        product: {
          on: ['goods_id', 'goods_id']
        }
      }).select();

      return data;
    })();
  }
};
//# sourceMappingURL=tongji.js.map