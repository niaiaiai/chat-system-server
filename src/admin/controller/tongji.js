const Base = require('./base.js');

module.exports = class extends Base {

  async soldAction() {
  	if (!this.isPost) {
      return false;
    }
    const dateRange = this.post('dateRange')
    //id,名称，销售量
    const data = await this.model('order').join({
      order_goods: {
      	join: 'inner',
      	on: ['order_sn', 'order_id']
      }
    }).where({add_time:['between',dateRange[0],dateRange[1]]}).field("sum(number) as number,goods_id,goods_name").group('goods_id').order('number DESC').select()
    //类型
    let sql = await this.model('order').where({add_time:['between',dateRange[0],dateRange[1]]}).join({
      order_goods: {
      	join: 'inner',
      	on: ['order_sn', 'order_id']
      }
    }).field("sum(number) as number,goods_id as goodsID,goods_name").group('goods_id').order('number DESC')
    .buildSelectSql()
    const sql1 = '(select number,goodsID,goods_name,category_id from '+ sql + 'as aaa left join nideshop.nideshop_goods on goodsID = nideshop.nideshop_goods.id) as abb left join nideshop.nideshop_category on category_id = id'
    const  specData = await this.model('goods').table(sql1).field('number as value,name').select()

    //销售量/库存
    const sql2 = sql + 'as aaa left join nideshop.nideshop_product on goodsID = nideshop.nideshop_product.goods_id'
    const storeData = await this.model('product').table(sql2).field('number, goods_id,goods_name,goods_number').select()
    return this.success({data:data,spec:specData,store:storeData})
  }


  async orderCountAction() {
  	if (!this.isPost) {
      return false;
    }
    const season = this.post('season')//0-3
    const dateRange = this.post('dateRange')
    let order = {}
    let after = {}
    let orderData = []
    let afterData = []
    for(let i =0;i<3; i++) {
      orderData = await this.model('order').where({add_time:['between',dateRange[i]]}).select()
      afterData = await this.model('order').where({add_time:['between',dateRange[i]],order_status:7}).select()
      order[(season*3+i+1)+'月'] = orderData.length
      after[(season*3+i+1)+'月'] = afterData.length
    }
    
  	return this.success({order:order,after:after})
  }

}