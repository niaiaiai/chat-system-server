function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
  // async avatarAction() {
  //   let avatarBase64 = this.post('avatar');
  //   if (think.isEmpty(avatarBase64)) {
  //     return this.fail('获取图片失败');
  //   }
  //   avatarBase64 = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
  //   const user_email = this.post('user_email')
  //   const that = this;

  //   const dataBuffer = new Buffer(avatarBase64, 'base64');
  //   const filename = '/static/avatar/'+user_email+'.jpg'
  //   fs.writeFileSync(think.ROOT_PATH + '/www'+filename, dataBuffer);
  //   // const filename = '/static/avatar/' + this.session('user_token').email + '.jpg';
  //   // const filename = '/static/avatar/1641084984@qq.com,' /*+ think.uuid(32)*/ + '.jpg';
  //   // const is = fs.createReadStream(avatarFile.path);
  //   // const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
  //   // is.pipe(os);

  //   // // save in database
  //   await this.model('user').where({user_email: user_email}).update({avatar:'http://47.107.155.139:8360' + filename+ '?'+think.uuid(32)})

  //   return that.success({
  //     name: filename,
  //     fileUrl: 'http://47.107.155.139:8360' + filename+'?'+think.uuid(32)
  //   });
  // }


  // async readAvatarAction() {
  //   if (!this.isPost) {
  //     return false;
  //   }
  //   const user_email = this.post('user_email')
  //   const path = think.ROOT_PATH + '/www/static/avatar/' + user_email + '.jpg'
  //   if(!fs.existsSync(path)) {
  //     return false
  //   }
  //   return this.success(path)
  // }

  fileAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const file = _this.file('file');
      if (think.isEmpty(file)) {
        return _this.fail('获取文件失败');
      }
      const that = _this;
      const user_email = '1641084984@qq.com';
      if (!fs.existsSync(think.ROOT_PATH + '/file/' + user_email)) {
        fs.mkdirSync(think.ROOT_PATH + '/file/' + user_email);
      }
      const is = fs.createReadStream(file.path);
      const os = fs.createWriteStream(think.ROOT_PATH + '/file/' + user_email + '/' + file.name);
      is.pipe(os);

      // const picName = think.uuid(32) + '.jpg';
      // if (fs.existsSync(think.ROOT_PATH + '/pic' + picName))
      //   return this.fail('图片已存在') 
      // const filename = '/'+picName;
      // const is = fs.createReadStream(picFile.path);
      // const os = fs.createWriteStream(think.ROOT_PATH + '/pic' + filename);
      // is.pipe(os);
      return that.success(file.name);
    })();
  }
};
//# sourceMappingURL=upload.js.map