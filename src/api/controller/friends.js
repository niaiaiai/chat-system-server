const Base = require('./base.js');

module.exports = class extends Base {
  async getFriends(user_email) {
  	const data = await this.model('relationship').where({['relationship.user_email']:user_email,friend_email:['!=',null]}).join({
      user:{
        join: 'left',
        on: ['friend_email','user_email']
      }
    }).field('friend_email,user_name,avatar').select()
    return data
  }

  async getFriendsAction() {
    if(!this.isPost){
      return false;
    }
    const user_email = this.post('email')
    const data = await this.getFriends(user_email)
    // const data = await this.model('relationship').where({['relationship.user_email']:email,friend_email:['!=',null]}).join({
    //   user:{
    //     join: 'left',
    //     on: ['friend_email','user_email']
    //   }
    // }).field('friend_email,user_name,avatar').select()
    return this.success(data)
  }
}