const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');

module.exports = class extends Base {
  async infoAction() {
    const userInfo = await this.model('user').where({id: this.getLoginUserId()}).find();
    delete userInfo.password;
    return this.json(userInfo);
  }

  /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
  async avatarAction() {
    let avatarBase64 = this.post('avatar');
    if (think.isEmpty(avatarBase64)) {
      return this.fail('获取图片失败');
    }
    avatarBase64 = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
    const user_email = this.post('user_email')
    const that = this;

    const dataBuffer = new Buffer(avatarBase64, 'base64');
    const filename = '/static/avatar/'+user_email+'.jpg'
    fs.writeFileSync(think.ROOT_PATH + '/www'+filename, dataBuffer);
    // const filename = '/static/avatar/' + this.session('user_token').email + '.jpg';
    // const filename = '/static/avatar/1641084984@qq.com,' /*+ think.uuid(32)*/ + '.jpg';
    // const is = fs.createReadStream(avatarFile.path);
    // const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    // is.pipe(os);

    // // save in database
    await this.model('user').where({user_email: user_email}).update({avatar:'http://47.107.155.139:8360' + filename+ '?'+think.uuid(32)})

    return that.success({
      name: filename,
      fileUrl: 'http://47.107.155.139:8360' + filename+'?'+think.uuid(32)
    });
  }

  async user_nameAction() {
    if(!this.isPost)
      return false
    const user_email = this.post('user_email')
    const user_name = this.post('user_name')
    await this.model('user').where({user_email:user_email}).update({user_name:user_name})
    return this.success(user_name)
  }


};
