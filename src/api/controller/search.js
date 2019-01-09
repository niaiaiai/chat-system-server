const Base = require('./base.js');

module.exports = class extends Base {

  async FriendAction() {
    if(!this.isPost)
      return false
    const searchValue = this.post('searchValue')
    const user_email = this.post('user_email')
    let data = []
    if(searchValue.trim() === '') {
      data = await this.model('relationship').where({['relationship.user_email']:user_email,friend_email:['!=',null]}).join({
        user:{
          join: 'left',
          on: ['friend_email','user_email']
        }
      }).field('friend_email,user_name,avatar').select()
    }
    else {
      if(searchValue.includes('@')) {
        data = await this.model('relationship').where({['relationship.user_email']:user_email,friend_email:searchValue}).join({
          user:{
            join: 'left',
            on: ['friend_email','user_email']
          }
        }).field('friend_email,user_name,avatar').select()
      }
      else {
        data = await this.model('relationship').where({['relationship.user_email']:user_email,['user.user_name']:['like',`%${searchValue}%`]}).join({
          user:{
            join: 'left',
            on: ['friend_email','user_email']
          }
        }).field('friend_email,user_name,avatar').select()
      }
    }
    return this.success(data)
  }

  async UserAction() {
    if(!this.isPost)
      return false
    const searchValue = this.post('value')
    let data = []
    if(searchValue.includes('@')) {
      // 搜索邮箱(账号)
      data = await this.model('user').where({ user_email: searchValue}).select() 
    }
    else {
      // 搜索名字(模糊查询)
      data = await this.model('user').where({user_name: ['like',`%${searchValue}%`]}).select()
    }
    return this.success(data);
  }

  async addGroupSearchAction() {
    if(!this.isPost)
      return false
    const searchValue = this.post('value')
    let data = await this.model('group').where({group_id:searchValue}).select()
    if(data.length === 0)
      data = await this.model('group').where({group_name: ['like',`%${searchValue}%`]}).select()
    return this.success(data)
  }
};
