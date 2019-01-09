module.exports = class extends think.Model {
  async getStore(dateRange) {
  	const data = await this.model('order').where({add_time:['between',dateRange[0],dateRange[1]]}).join({
      order_goods: {
      	join: 'inner',
      	on: ['order_sn', 'order_id']
      },
      product: {
      	on: ['goods_id','goods_id']
      }
    }).select()

    return data
  }
}