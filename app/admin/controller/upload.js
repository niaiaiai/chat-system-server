function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
  brandPicAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const brandFile = _this.file('pic');
      if (think.isEmpty(brandFile)) {
        return _this.fail('保存失败');
      }
      const that = _this;
      const filename = '/static/default/' + think.uuid(32) + '.jpg';
      const is = fs.createReadStream(brandFile.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
      is.pipe(os);

      return that.success({
        name: 'pic',
        fileUrl: 'http://127.0.0.1:8360' + filename
      });
    })();
  }

  appendDirAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) {
        return false;
      }
      const folderTitle = _this2.post('folderTitle');
      fs.mkdir(think.ROOT_PATH + '/www/static/default' + folderTitle, function (err) {
        if (err) return this.fail(err);
        return this.success();
      });
    })();
  }

  readFloderAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.isPost) {
        return false;
      }
      let Files = [];
      const dir = _this3.post('dir');
      let stat = 0;
      const files = fs.readdirSync(think.ROOT_PATH + '/www/static/default' + dir);
      for (var i = 0; i < files.length; i++) {
        if (fs.statSync(think.ROOT_PATH + '/www/static/default' + dir + '/' + files[i]).isDirectory()) {
          const f = fs.readdirSync(think.ROOT_PATH + '/www/static/default' + dir + '/' + files[i]);
          if (!think.isEmpty(f)) {
            for (var j = 0; j < f.length && fs.statSync(think.ROOT_PATH + '/www/static/default' + dir + '/' + files[i] + '/' + f[j]).isDirectory(); j++) {
              Files.push({ title: files[i], expand: false, children: [{}] });
              stat = 1;
              break;
            }
            if (!stat) Files.push({ title: files[i], expand: false });
          } else {
            Files.push({ title: files[i], expand: false });
          }
        }
      }
      return _this3.success(Files);
    })();
  }

  readPicsAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.isPost) {
        return false;
      }
      let Files = [];
      const dir = _this4.post('dir');
      const files = fs.readdirSync(think.ROOT_PATH + '/www/static/default' + dir);
      for (var i = 0; i < files.length; i++) {
        if (fs.statSync(think.ROOT_PATH + '/www/static/default' + dir + '/' + files[i]).isFile()) {
          Files.push({ name: files[i], url: 'http://127.0.0.1:8360/static/default/' + files[i], status: 'finished' });
        }
      }
      return _this4.success(Files);
    })();
  }

  removePicAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      if (!_this5.isPost) {
        return false;
      }
      const path = _this5.post('path');
      fs.unlinkSync(think.ROOT_PATH + '/www/static/default/' + path);
      return _this5.success('ok');
    })();
  }

  renameAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      if (!_this6.isPost) {
        return false;
      }
      const old = _this6.post('old');
      const newName = _this6.post('new');
      const path = _this6.post('path');
      fs.rename(think.ROOT_PATH + '/www/static/default' + path + '/' + old, think.ROOT_PATH + '/www/static/default' + path + '/' + newName);
      return _this6.success();
    })();
  }
};
//# sourceMappingURL=upload.js.map