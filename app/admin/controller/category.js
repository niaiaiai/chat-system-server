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
      const model = _this.model('category');
      const data = yield model.where({ is_show: 1 }).order(['sort_order ASC']).select();
      const topCategory = data.filter(function (item) {
        return item.parent_id === 0;
      });
      const categoryList = [];
      topCategory.map(function (item) {
        item.level = 1;
        categoryList.push({ title: item.name + '(' + item.id + ')', expand: false, children: [] });
        data.map(function (child) {
          if (child.parent_id === item.id) {
            child.level = 2;
            child.parent_id = item.name;
            categoryList[categoryList.length - 1].children.push({ title: child.name + '(' + child.id + ')', expand: false });
          }
        });
      });
      return _this.success(categoryList);
    })();
  }

  topCategoryAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const model = _this2.model('category');
      const data = yield model.where({ parent_id: 0 }).select();

      return _this2.success(data);
    })();
  }

  secondCategoryAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const model = _this3.model('category');
      const data = yield model.where({ parent_id: ['!=', 0] }).select();
      return _this3.success(data);
    })();
  }

  // async infoAction() {
  //   if (!this.isPost) {
  //     return false;
  //   }
  //   const parent = this.post('parent');
  //   const model = this.model('category');
  //   const data = await model.where({parent_id: parent}).select();

  //   return this.success(data);
  // }

  storeAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.isPost) {
        return false;
      }

      const id = _this4.post('id');
      const level = _this4.post('level');
      const parent = _this4.post('parent');
      if (level == 1) {
        yield _this4.model('category').where({ id: id }).update({ level: 'L' + level, parent_id: 0 });
      }
      if (level == 2) {
        yield _this4.model('category').where({ id: id }).update({ parent_id: parent });
      }
      // const updateObject = {};
      // updateObject[key] = value;
      return _this4.success();
    })();
  }

  addAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      if (!_this5.isPost) {
        return false;
      }
      const id = yield _this5.model('category').max('id');
      const name = _this5.post('name');
      const parent = _this5.post('parent');
      let insertData = {};
      if (parent == 0) {
        insertData = { id: id + 1, name: name, keywords: '', front_desc: '', parent_id: parent, sort_order: 1, show_index: 1, is_show: 1, banner_url: 'http://yanxuan.nosdn.127.net/b60618db213322bdc2c5b1208655bd7e.png', icon_url: '', img_url: '', wap_banner_url: 'http://yanxuan.nosdn.127.net/470a017f508e9a18f3068be7b315e14b.png', level: 'L1', type: 0, front_name: '' };
        yield _this5.model('category').add(insertData);
        insertData.level = 1;
      } else {
        insertData = { id: id + 1, name: name, keywords: '', front_desc: '', parent_id: parent, sort_order: 1, show_index: 1, is_show: 1, banner_url: 'http://yanxuan.nosdn.127.net/b60618db213322bdc2c5b1208655bd7e.png', icon_url: '', img_url: '', wap_banner_url: 'http://yanxuan.nosdn.127.net/470a017f508e9a18f3068be7b315e14b.png', level: 'L2', type: 0, front_name: '' };
        yield _this5.model('category').add(insertData);
        //insertData.level=2;
      }
      return _this5.success(insertData);
    })();
  }

  editAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      if (!_this6.isPost) {
        return false;
      }
      const id = _this6.post('id');
      const name = _this6.post('name');
      yield _this6.model('category').where({ id: id }).update({ name: name });
      return _this6.success();
    })();
  }

  destroyAction() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const id = _this7.post('id');
      yield _this7.model('category').where({ id: id }).limit(1).delete();
      // TODO 删除图片

      return _this7.success();
    })();
  }
};
//# sourceMappingURL=category.js.map