const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const orderSn = this.get('orderSn') || '';
    const consignee = this.get('consignee') || '';

    const model = this.model('order');
    const data = await model.where({order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, size).countSelect();
    const newList = [];
    for (const item of data.data) {
      item.order_status_text = await this.model('order').getOrderStatusText(item.id);
      newList.push(item);
    }
    data.data = newList;
    return this.success(data);
  }

  async findAction() {
    let orderdata;
    if (!think.isEmpty(this.post('stat'))) {
      orderdata = await this.model('order').where({order_status:this.post('stat')}).select();
    }
    else {
      orderdata = await this.model('order').select();
    }
    let data = [];
    for(var i=0; i<orderdata.length; i++) {
      const userid = orderdata[i].user_id;
      const orderid = orderdata[i].order_sn;
      let status = '';
      const username = await this.model('user').where({id:userid}).getField('username');
      if(orderdata[i].order_status == 1){
        status = '未发货';
      }
      if(orderdata[i].order_status == 2){
        status = '已发货';
      }
      if(orderdata[i].order_status == 3){
        status = '订单已取消'
      }
      const datainfo = await this.model('order_goods').where({order_id:orderid}).select();
      const shipper = await this.model('order_express').where({order_id:orderid}).find();
      data[i] = {id: orderid,username:username[0],order_price:orderdata[i].order_price,order_status:orderdata[i].order_status,status:status,info:datainfo,express:shipper.shipper_id,expressName:shipper.shipper_name};
    }
    return this.success(data);
  }

  async expressAction() {
    if (!this.isPost) {
      return false;
    }
    const shippername = await this.model('shipper').getField('name');
    return this.success(shippername);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('order');
    values.is_show = values.is_show ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async deliveryAction() {
    if (!this.isPost||!Number(this.post('No'))) {
      return false;
    }
    const orderid = this.post('id');
    const no = this.post('No');
    const shipper_name = this.post('express')
    let id = await this.model('order_express').max('id');
    if(id == null){
      id = 1;
    }
    const insertObject = {id:(id+1),order_id:orderid,shipper_id:Number(no),shipper_name:shipper_name};
    await this.model('order_express').add(insertObject);
    await this.model('order').where({id: orderid}).update({order_status:2});
    return this.success(insertObject);
  }

  async destroyAction() {
    if (!this.isPost) {
      return false;
    }
    const id = this.post('id');
    await this.model('order').where({id: id}).update({order_status:0});

    return this.success();
  }
};
