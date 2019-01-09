function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');
// const rp = require('request-promise');

module.exports = class extends Base {
  // async loginByWeixinAction() {
  //   const code = this.post('code');
  //   const fullUserInfo = this.post('userInfo');
  //   const userInfo = fullUserInfo.userInfo;
  //   const clientIp = ''; // 暂时不记录 ip

  //   // 获取openid
  //   const options = {
  //     method: 'GET',
  //     url: 'https://api.weixin.qq.com/sns/jscode2session',
  //     qs: {
  //       grant_type: 'authorization_code',
  //       js_code: code,
  //       secret: think.config('weixin.secret'),
  //       appid: think.config('weixin.appid')
  //     }
  //   };

  //   let sessionData = await rp(options);
  //   sessionData = JSON.parse(sessionData);
  //   if (!sessionData.openid) {
  //     return this.fail('登录失败');
  //   }

  //   // 验证用户信息完整性
  //   const crypto = require('crypto');
  //   const sha1 = crypto.createHash('sha1').update(fullUserInfo.rawData + sessionData.session_key).digest('hex');
  //   if (fullUserInfo.signature !== sha1) {
  //     return this.fail('登录失败');
  //   }

  //   // 解释用户数据
  //   const WeixinSerivce = this.service('weixin', 'api');
  //   const weixinUserInfo = await WeixinSerivce.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv);
  //   if (think.isEmpty(weixinUserInfo)) {
  //     return this.fail('登录失败');
  //   }

  //   // 根据openid查找用户是否已经注册
  //   let userId = await this.model('user').where({ weixin_openid: sessionData.openid }).getField('id', true);
  //   if (think.isEmpty(userId)) {
  //     // 注册
  //     userId = await this.model('user').add({
  //       username: '微信用户' + think.uuid(6),
  //       password: sessionData.openid,
  //       register_time: parseInt(new Date().getTime() / 1000),
  //       register_ip: clientIp,
  //       last_login_time: parseInt(new Date().getTime() / 1000),
  //       last_login_ip: clientIp,
  //       mobile: '',
  //       weixin_openid: sessionData.openid,
  //       avatar: userInfo.avatarUrl || '',
  //       gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
  //       nickname: userInfo.nickName
  //     });
  //   }

  //   sessionData.user_id = userId;

  //   // 查询用户信息
  //   const newUserInfo = await this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

  //   // 更新登录信息
  //   userId = await this.model('user').where({ id: userId }).update({
  //     last_login_time: parseInt(new Date().getTime() / 1000),
  //     last_login_ip: clientIp
  //   });

  //   const TokenSerivce = this.service('token', 'api');
  //   const sessionKey = await TokenSerivce.create(sessionData);

  //   if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
  //     return this.fail('登录失败');
  //   }

  //   return this.success({ token: sessionKey, userInfo: newUserInfo });
  // }

  registerAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.isPost) {
        return false;
      }
      const email = _this.post('email');
      const emailData = yield _this.model('user').where({ user_email: email }).select();
      if (!think.isEmpty(emailData)) {
        return _this.fail(email + ' 这个邮箱已被注册，请重新输入邮箱');
      }
      const username = _this.post('username');
      const password = _this.post('password');
      const id = yield _this.model('user').max('id');
      yield _this.model('user').add({ id: id + 1, user_name: username, password: password, user_email: email });
      return _this.success(email + ' 注册成功');
    })();
  }

  loginAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (!_this2.isPost) {
        return false;
      }
      const email = _this2.post('email');
      const password = _this2.post('password');
      const data = yield _this2.model('user').where({ user_email: email, password: password }).find();
      //session
      yield _this2.session('user_token', data);
      return _this2.success(data);
    })();
  }

  logoutAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      yield _this3.session();
      return _this3.success();
    })();
  }

  getUserAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.isPost) {
        return false;
      }
      const token = yield _this4.session('user_token');
      // const token = this.getUser()
      if (think.isEmpty(token)) {
        return _this4.fail();
      }

      return _this4.success(token);
    })();
  }
};
//# sourceMappingURL=auth.js.map