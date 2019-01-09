const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const model = this.model('user');
    const data = await model.where({username: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
  }

  async memberInfoAction() {
    if (!this.isPost) {
      return false;
    }
    const data = await this.model('vip').join({user:{join:'inner',on:['id','user_level_id']}}).select()
    return this.success(data)
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('user');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const level_id = this.post('level_id');
    const id = this.post('id');

    const model = this.model('user');
    await model.where({id: id}).update({user_level_id:level_id});
    let data = await this.model('vip').where({id:level_id}).find()
    return this.success(data);
  }

  async destroyAction() {
    const id = this.post('id');
    await this.model('user').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }

  async addAction() {
    if (!this.isPost) {
      return false;
    }
    const id = await this.model('user').max('id')
    const username = this.post('username')
    const level_id = this.post('level_id')
    let insertData = {id:(id+1),username:username,password:'',gender:0,birthday:0,register_time:0,last_login_time:0,last_login_ip:'',user_level_id:level_id,nickname:username,mobile:'',register_ip:'',avater:'',weixin_openid:''}
    await this.model('user').add(insertData)
    const data = await this.model('vip').where({id:level_id}).find()
    insertData.name = data.name
    insertData.description= data.description
    return this.success(insertData)
  }
};
