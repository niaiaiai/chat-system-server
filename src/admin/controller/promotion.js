const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
  	const data = await this.model('coupon').select()
  	return this.success(data)
  }

  // async discountAction() {
  //   const data = await this.model()
  // }

  async addAction() {
  	if (!this.isPost) {
      return false;
    }
    const id = await this.model('coupon').max('id')
    const name = this.post('name')
    const type_money = this.post('type_money')
    const send_start_date = this.post('send_start_date')
    let insertData = {id:(id+1),name:name,type_money:type_money,send_type:(id+1),min_amount:0,max_amount:0,send_start_date:send_start_date,send_end_date:0,use_start_date:0,use_end_date:0,min_goods_amount:0}
    await this.model('coupon').add(insertData)
    return this.success(insertData)
  }

  async editAction() {
  	if (!this.isPost) {
      return false;
    }
    const id = this.post('id')
    const name = this.post('name')
    const type_money = this.post('type_money')
    const send_start_date = this.post('send_start_date')
    await this.model('coupon').where({id:id}).update({name:name,type_money:type_money,send_start_date:send_start_date})
    return this.success()
  }

  async destroyAction() {
  	if (!this.isPost) {
      return false;
    }
    const id = this.post('id')
    await this.model('coupon').where({id:id}).limit(1).delete()
    return this.success()
  }
}