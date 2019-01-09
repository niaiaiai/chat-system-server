const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const model = this.model('goods');
    const data = await model.where({name: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('goods');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('goods');
    values.is_on_sale = values.is_on_sale ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    values.is_hot = values.is_hot ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async goodsAction() {
    const CurrentPage = this.get('data');
    // const goods = await this.model('goods').select();
    const goods = await this.model('goods').page(Number(CurrentPage),30).countSelect();
    const data=[goods.data.length];
    for(var i=0; i<goods.data.length; i++){
      const goodsID = goods.data[i].id;
      const CategoryID = goods.data[i].category_id;
      const classification = await this.model('category').where({id:CategoryID}).find();
      const storeandprice = await this.model('product').where({goods_id:goodsID}).find();
      const PicPath = goods.data[i].primary_pic_url;
      
      data[i] = {id:goods.data[i].id, name:goods.data[i].name, Classification:classification.name, price:storeandprice.retail_price, unit:goods.data[i].goods_unit,store:storeandprice.goods_number,pic:PicPath};
    }

    return this.success({data:data,totalPages:goods.totalPages});
  }

  // 导出excel用
  async AllGoodsAction() {
    const goods = await this.model('goods').select();
    const data=[goods.length];
    for(var i=0; i<goods.length; i++){
      const goodsID = goods[i].id;
      const CategoryID = goods[i].category_id;
      const classification = await this.model('category').where({id:CategoryID}).find();
      const storeandprice = await this.model('product').where({goods_id:goodsID}).find();
      data[i] = {id:goods[i].id, name:goods[i].name, Classification:classification.name, price:storeandprice.retail_price, unit:goods[i].goods_unit,store:storeandprice.goods_number};
    }
    return this.success(data);
  }

  async addAction() {
    if (!this.isPost) {
      return false;
    }
    const categoryID = this.post('id');
    const name = this.post('name');
    const price = this.post('price');
    const store = this.post('store');
    const unit = this.post('unit');
    const remark = this.post('remark');
    const pic = this.post('pic');

    const model = this.model('goods');
    const id = await model.max('id');
    const productID = await this.model('product').max('id');
    const insertData = {id:(id+1),category_id: categoryID, goods_sn: (id+1).toString(),name:name,brand_id:0,goods_number:100,keywords:' ',goods_brief:remark,goods_desc:' ',is_on_sale:1,add_time:0,sort_order:2,is_delete:0,attrbute_category:0,counter_price:0.00,extra_pricd:0.00,is_new:0,goods_unit:unit,primary_pic_url:pic,list_pic_url:pic,retail_price:Number(price),sell_volume:10,primary_product_id:11111,unit_price:0.00,promotion_desc:'限时购',promotion_tag:' ',app_exclusive_price:0.00,is_app_exclusive:0,is_limited:0,is_hot:0};
    const insertData1 = {id:(productID+1),goods_id:(id+1),goods_specification_ids:' ',goods_sn:(id+1),goods_number:Number(store),retail_price:Number(price)};
    const insertId = await model.add(insertData);
    const insertId1 = await this.model('product').add(insertData1);
    const classification = await this.model('category').where({id:categoryID}).find();
    return this.success({data:insertData,data1:insertData1,categoryName:classification.name});
  }

  async editAction() {
    if (!this.isPost) {
      return false;
    }
    const id = this.post('id');
    const key = this.post('key');
    const value = this.post('value');
    const updateObject = {};
    updateObject[key] = value;
    if(key == 'name' || key == 'category_id' || key == 'unit' || 'primary_pic_url') {
      const affectedRows = await this.model('goods').where({id:id}).update(updateObject);
    }
    else {
      const affectedRows = await this.model('product').where({goods_id:id}).update(updateObject);
    }
    return this.success(updateObject);
  }

  async destroyAction() {
    const id = this.post('id');
    const ids = this.post('ids');
    if(!think.isEmpty(id)) {
      await this.model('goods').where({id: id}).limit(1).delete();
      await this.model('product').where({goods_id:id}).limit(1).delete();
    }
    if(!think.isEmpty(ids)) {
      await this.model('goods').where({id: ['in',ids]}).delete();
      await this.model('product').where({goods_id:['in',ids]}).delete();
    }

    return this.success();
  }
};
