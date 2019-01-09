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
      const orderSn = _this.get('orderSn') || '';
      const consignee = _this.get('consignee') || '';

      const model = _this.model('order');
      const data = yield model.where({ order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`] }).order(['id DESC']).page(page, size).countSelect();
      const newList = [];
      for (const item of data.data) {
        item.order_status_text = yield _this.model('order').getOrderStatusText(item.id);
        newList.push(item);
      }
      data.data = newList;
      return _this.success(data);
    })();
  }

  findAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let orderdata;
      if (!think.isEmpty(_this2.post('stat'))) {
        orderdata = yield _this2.model('order').where({ order_status: _this2.post('stat') }).select();
      } else {
        orderdata = yield _this2.model('order').select();
      }
      let data = [];
      for (var i = 0; i < orderdata.length; i++) {
        const userid = orderdata[i].user_id;
        const orderid = orderdata[i].order_sn;
        let status = '';
        const username = yield _this2.model('user').where({ id: userid }).getField('username');
        if (orderdata[i].order_status == 1) {
          status = '未发货';
        }
        if (orderdata[i].order_status == 2) {
          status = '已发货';
        }
        if (orderdata[i].order_status == 3) {
          status = '订单已取消';
        }
        const datainfo = yield _this2.model('order_goods').where({ order_id: orderid }).select();
        const shipper = yield _this2.model('order_express').where({ order_id: orderid }).find();
        data[i] = { id: orderid, username: username[0], order_price: orderdata[i].order_price, order_status: orderdata[i].order_status, status: status, info: datainfo, express: shipper.shipper_id, expressName: shipper.shipper_name };
      }
      return _this2.success(data);
    })();
  }

  expressAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) {
        return false;
      }
      const shippername = yield _this3.model('shipper').getField('name');
      return _this3.success(shippername);
    })();
  }

  storeAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.isPost) {
        return false;
      }

      const values = _this4.post();
      const id = _this4.post('id');

      const model = _this4.model('order');
      values.is_show = values.is_show ? 1 : 0;
      values.is_new = values.is_new ? 1 : 0;
      if (id > 0) {
        yield model.where({ id: id }).update(values);
      } else {
        delete values.id;
        yield model.add(values);
      }
      return _this4.success(values);
    })();
  }

  deliveryAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      if (!_this5.isPost || !Number(_this5.post('No'))) {
        return false;
      }
      const orderid = _this5.post('id');
      const no = _this5.post('No');
      const shipper_name = _this5.post('express');
      let id = yield _this5.model('order_express').max('id');
      if (id == null) {
        id = 1;
      }
      const insertObject = { id: id + 1, order_id: orderid, shipper_id: Number(no), shipper_name: shipper_name };
      yield _this5.model('order_express').add(insertObject);
      yield _this5.model('order').where({ id: orderid }).update({ order_status: 2 });
      return _this5.success(insertObject);
    })();
  }

  destroyAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      if (!_this6.isPost) {
        return false;
      }
      const id = _this6.post('id');
      yield _this6.model('order').where({ id: id }).update({ order_status: 0 });

      return _this6.success();
    })();
  }
};
//# sourceMappingURL=order.js.map