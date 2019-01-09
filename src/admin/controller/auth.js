const Base = require('./base.js');

module.exports = class extends Base {
  async loAction() {
    const username = this.post('userName');
    const password = this.post('password');

    const admin = await this.model('admin').where({ username: username }).find();
    if (think.isEmpty(admin)) {
      return this.success();
    }

    if (password !== admin.password) {
      return this.success();
    }

    // 更新登录信息
    await this.model('admin').where({ id: admin.id }).update({
      last_login_time: parseInt(Date.now() / 1000),
      last_login_ip: this.ctx.ip
    });

    const TokenSerivce = this.service('token', 'admin');
    const sessionKey = await TokenSerivce.create({
      user_id: admin.id
    });

    if (think.isEmpty(sessionKey)) {
      return '';
    }

    const userInfo = {
      id: admin.id,
      username: admin.username,
      avatar: admin.avatar,
      admin_role_id: admin.admin_role_id
    };

    return this.success({ code: 200, token: username });
  }

  async infoAction(){
    const token = this.get('token');
    return this.success({code:200,access:[token,'admin'],avatar:'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',user_id:'14138',user_name:token});
  }
};
