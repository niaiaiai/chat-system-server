const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
  	const data = await this.model('vip').select()
  	return this.success(data)
  }

  async editAction() {
  	if (!this.isPost) {
      return false;
    }
    const id = this.post('id')
    const name = this.post('name')
    const description = this.post('description')
    const data = await this.model('vip').where({id:id}).update({name:name,description:description})
    return this.success()
  }

  async addAction() {
  	if (!this.isPost) {
      return false;
    }
    const id = await this.model('vip').max('id')
    const name = this.post('name')
    const description = this.post('description')
    await this.model('vip').add({id:(id+1),name:name,description:description})
    return this.success({id:(id+1),name:name,description:description})
  }

  async destroyAction() {
  	if (!this.isPost) {
      return false;
    }
    const id = this.post('id')
    await this.model('vip').where({id:id}).limit(1).delete()
    return this.success()
  }
}