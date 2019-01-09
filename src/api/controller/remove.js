const Base = require('./base.js');
module.exports = class extends Base {
  async removeFriendAction() {
  	if(!this.isPost)
  	  return false
  	const user_email = this.post('user_email')
  	const friend_email = this.post('friend_email')
  	await this.model('relationship').where({user_email:user_email,friend_email:friend_email}).delete()
  	await this.model('relationship').where({user_email:friend_email,friend_email:user_email}).delete()
  	return this.success(friend_email)
  }

  async leaveGroupAction() {
  	if(!this.isPost)
  	  return false
  	const user_email = this.post('user_email')
  	const group_id = this.post('group_id')
  	await this.model('relationship').where({user_email:user_email,group_id:group_id}).delete()
  	return this.success(group_id)
  }

  
}