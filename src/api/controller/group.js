const Base = require('./base.js');
module.exports = class extends Base {
  async createAction() {
  	if(!this.isPost)
  	  return false
  	const name = this.post('name')
  	const leader = this.post('leader')
  	const idgroup = await this.model('group').max('id')
  	let group_id = Math.round(Math.random()*10000)
  	let existGroup = await this.model('group').where({group_id:group_id}).select()
  	while(existGroup.length > 0) {
  		group_id = Math.round(Math.random()*10000)
  		existGroup = await this.model('group').where({group_id:group_id}).select()
  	}

  	await this.model('group').add({id:idgroup+1,group_id:group_id,group_name:name,leader:leader})
  	const data = await this.model('group').where({id:idgroup+1}).select()
  	if(data.length === 0)
  		return false

  	const idrelationship = await this.model('relationship').max('id')
  	await this.model('relationship').add({id:idrelationship+1,user_email:leader,group_id:data[0].group_id})
  	return this.success(data)
  	// join group
  }

  async getGroupAction() {
  	if(!this.isPost){
      return false;
    }
    const email = this.post('email')
    const data = await this.model('relationship').where({user_email:email,['relationship.group_id']:['!=',null]}).join({
    	group:{
    		join: 'left',
    		on: ['group_id','group_id']
    	}
    }).field('leader,relationship.group_id,group_name').select()
  	return this.success(data)
  }

  async getGroupMembersAction() {
  	if(!this.isPost)
  		return false
  	const group_id = this.post('group_id')
  	const data = await this.model('relationship').where({group_id:group_id}).join({
  		user:{
  			join: 'left',
  			on: ['user_email','user_email']
  		}
  	}).field('relationship.user_email,user_name').select()
  	return this.success(data)
  }
}