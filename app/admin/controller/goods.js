function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const fs = require('fs');

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

      const model = _this.model('goods');
      const data = yield model.where({ name: ['like', `%${name}%`] }).order(['id DESC']).page(page, size).countSelect();

      return _this.success(data);
    })();
  }

  infoAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const id = _this2.get('id');
      const model = _this2.model('goods');
      const data = yield model.where({ id: id }).find();

      return _this2.success(data);
    })();
  }

  storeAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) {
        return false;
      }

      const values = _this3.post();
      const id = _this3.post('id');

      const model = _this3.model('goods');
      values.is_on_sale = values.is_on_sale ? 1 : 0;
      values.is_new = values.is_new ? 1 : 0;
      values.is_hot = values.is_hot ? 1 : 0;
      if (id > 0) {
        yield model.where({ id: id }).update(values);
      } else {
        delete values.id;
        yield model.add(values);
      }
      return _this3.success(values);
    })();
  }

  goodsAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const CurrentPage = _this4.get('data');
      // const goods = await this.model('goods').select();
      const goods = yield _this4.model('goods').page(Number(CurrentPage), 30).countSelect();
      const data = [goods.data.length];
      for (var i = 0; i < goods.data.length; i++) {
        const goodsID = goods.data[i].id;
        const CategoryID = goods.data[i].category_id;
        const classification = yield _this4.model('category').where({ id: CategoryID }).find();
        const storeandprice = yield _this4.model('product').where({ goods_id: goodsID }).find();
        const PicPath = goods.data[i].primary_pic_url;

        data[i] = { id: goods.data[i].id, name: goods.data[i].name, Classification: classification.name, price: storeandprice.retail_price, unit: goods.data[i].goods_unit, store: storeandprice.goods_number, pic: PicPath };
      }

      return _this4.success({ data: data, totalPages: goods.totalPages });
    })();
  }

  // 导出excel用
  AllGoodsAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const goods = yield _this5.model('goods').select();
      const data = [goods.length];
      for (var i = 0; i < goods.length; i++) {
        const goodsID = goods[i].id;
        const CategoryID = goods[i].category_id;
        const classification = yield _this5.model('category').where({ id: CategoryID }).find();
        const storeandprice = yield _this5.model('product').where({ goods_id: goodsID }).find();
        data[i] = { id: goods[i].id, name: goods[i].name, Classification: classification.name, price: storeandprice.retail_price, unit: goods[i].goods_unit, store: storeandprice.goods_number };
      }
      return _this5.success(data);
    })();
  }

  addAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      if (!_this6.isPost) {
        return false;
      }
      const categoryID = _this6.post('id');
      const name = _this6.post('name');
      const price = _this6.post('price');
      const store = _this6.post('store');
      const unit = _this6.post('unit');
      const remark = _this6.post('remark');
      const pic = _this6.post('pic');

      const model = _this6.model('goods');
      const id = yield model.max('id');
      const productID = yield _this6.model('product').max('id');
      const insertData = { id: id + 1, category_id: categoryID, goods_sn: (id + 1).toString(), name: name, brand_id: 0, goods_number: 100, keywords: ' ', goods_brief: remark, goods_desc: ' ', is_on_sale: 1, add_time: 0, sort_order: 2, is_delete: 0, attrbute_category: 0, counter_price: 0.00, extra_pricd: 0.00, is_new: 0, goods_unit: unit, primary_pic_url: pic, list_pic_url: pic, retail_price: Number(price), sell_volume: 10, primary_product_id: 11111, unit_price: 0.00, promotion_desc: '限时购', promotion_tag: ' ', app_exclusive_price: 0.00, is_app_exclusive: 0, is_limited: 0, is_hot: 0 };
      const insertData1 = { id: productID + 1, goods_id: id + 1, goods_specification_ids: ' ', goods_sn: id + 1, goods_number: Number(store), retail_price: Number(price) };
      const insertId = yield model.add(insertData);
      const insertId1 = yield _this6.model('product').add(insertData1);
      const classification = yield _this6.model('category').where({ id: categoryID }).find();
      return _this6.success({ data: insertData, data1: insertData1, categoryName: classification.name });
    })();
  }

  editAction() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      if (!_this7.isPost) {
        return false;
      }
      const id = _this7.post('id');
      const key = _this7.post('key');
      const value = _this7.post('value');
      const updateObject = {};
      updateObject[key] = value;
      if (key == 'name' || key == 'category_id' || key == 'unit' || 'primary_pic_url') {
        const affectedRows = yield _this7.model('goods').where({ id: id }).update(updateObject);
      } else {
        const affectedRows = yield _this7.model('product').where({ goods_id: id }).update(updateObject);
      }
      return _this7.success(updateObject);
    })();
  }

  destroyAction() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const id = _this8.post('id');
      const ids = _this8.post('ids');
      if (!think.isEmpty(id)) {
        yield _this8.model('goods').where({ id: id }).limit(1).delete();
        yield _this8.model('product').where({ goods_id: id }).limit(1).delete();
      }
      if (!think.isEmpty(ids)) {
        yield _this8.model('goods').where({ id: ['in', ids] }).delete();
        yield _this8.model('product').where({ goods_id: ['in', ids] }).delete();
      }

      return _this8.success();
    })();
  }
};
//# sourceMappingURL=goods.js.map