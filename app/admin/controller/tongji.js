function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

module.exports = class extends Base {

  soldAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.isPost) {
        return false;
      }
      const dateRange = _this.post('dateRange');
      //id,名称，销售量
      const data = yield _this.model('order').join({
        order_goods: {
          join: 'inner',
          on: ['order_sn', 'order_id']
        }
      }).where({ add_time: ['between', dateRange[0], dateRange[1]] }).field("sum(number) as number,goods_id,goods_name").group('goods_id').order('number DESC').select();
      //类型
      let sql = yield _this.model('order').where({ add_time: ['between', dateRange[0], dateRange[1]] }).join({
        order_goods: {
          join: 'inner',
          on: ['order_sn', 'order_id']
        }
      }).field("sum(number) as number,goods_id as goodsID,goods_name").group('goods_id').order('number DESC').buildSelectSql();
      const sql1 = '(select number,goodsID,goods_name,category_id from ' + sql + 'as aaa left join nideshop.nideshop_goods on goodsID = nideshop.nideshop_goods.id) as abb left join nideshop.nideshop_category on category_id = id';
      const specData = yield _this.model('goods').table(sql1).field('number as value,name').select();

      //销售量/库存
      const sql2 = sql + 'as aaa left join nideshop.nideshop_product on goodsID = nideshop.nideshop_product.goods_id';
      const storeData = yield _this.model('product').table(sql2).field('number, goods_id,goods_name,goods_number').select();
      return _this.success({ data: data, spec: specData, store: storeData });
    })();
  }

  orderCountAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) {
        return false;
      }
      const season = _this2.post('season'); //0-3
      const dateRange = _this2.post('dateRange');
      let order = {};
      let after = {};
      let orderData = [];
      let afterData = [];
      for (let i = 0; i < 3; i++) {
        orderData = yield _this2.model('order').where({ add_time: ['between', dateRange[i]] }).select();
        afterData = yield _this2.model('order').where({ add_time: ['between', dateRange[i]], order_status: 7 }).select();
        order[season * 3 + i + 1 + '月'] = orderData.length;
        after[season * 3 + i + 1 + '月'] = afterData.length;
      }

      return _this2.success({ order: order, after: after });
    })();
  }

};
//# sourceMappingURL=tongji.js.map