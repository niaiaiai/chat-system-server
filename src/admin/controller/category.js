const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const model = this.model('category');
    const data = await model.where({is_show: 1}).order(['sort_order ASC']).select();
    const topCategory = data.filter((item) => {
      return item.parent_id === 0;
    });
    const categoryList = [];
    topCategory.map((item) => {
      item.level = 1;
      categoryList.push({ title:item.name + '(' + item.id + ')', expand: false, children: []});
      data.map((child) => {
        if (child.parent_id === item.id) {
          child.level = 2;
          child.parent_id = item.name;
          categoryList[categoryList.length-1].children.push({ title: child.name + '(' + child.id + ')', expand: false});
        }
      });
    });
    return this.success(categoryList);
  }

  async topCategoryAction() {
    const model = this.model('category');
    const data = await model.where({parent_id: 0}).select();

    return this.success(data);
  }

  async secondCategoryAction() {
    const model = this.model('category');
    const data = await model.where({parent_id:['!=',0]}).select();
    return this.success(data);
  }

  // async infoAction() {
  //   if (!this.isPost) {
  //     return false;
  //   }
  //   const parent = this.post('parent');
  //   const model = this.model('category');
  //   const data = await model.where({parent_id: parent}).select();
    
  //   return this.success(data);
  // }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const id = this.post('id');
    const level = this.post('level');
    const parent = this.post('parent');
    if(level == 1) {
      await this.model('category').where({id:id}).update({level:'L'+level,parent_id:0});
    }
    if(level == 2) {
      await this.model('category').where({id:id}).update({parent_id:parent})
    }
    // const updateObject = {};
    // updateObject[key] = value;
    return this.success();
  }

  async addAction() {
    if (!this.isPost) {
      return false;
    }
    const id = await this.model('category').max('id');
    const name = this.post('name');
    const parent = this.post('parent');
    let insertData = {};
    if(parent == 0){
      insertData = {id:(id+1),name:name,keywords:'',front_desc:'',parent_id:parent,sort_order:1,show_index:1,is_show:1,banner_url:'http://yanxuan.nosdn.127.net/b60618db213322bdc2c5b1208655bd7e.png',icon_url:'',img_url:'',wap_banner_url:'http://yanxuan.nosdn.127.net/470a017f508e9a18f3068be7b315e14b.png',level:'L1',type:0,front_name:''};
    await this.model('category').add(insertData);
    insertData.level=1;
    }
    else{
      insertData = {id:(id+1),name:name,keywords:'',front_desc:'',parent_id:parent,sort_order:1,show_index:1,is_show:1,banner_url:'http://yanxuan.nosdn.127.net/b60618db213322bdc2c5b1208655bd7e.png',icon_url:'',img_url:'',wap_banner_url:'http://yanxuan.nosdn.127.net/470a017f508e9a18f3068be7b315e14b.png',level:'L2',type:0,front_name:''};
    await this.model('category').add(insertData);
    //insertData.level=2;
    }
    return this.success(insertData);
  }

  async editAction() {
    if (!this.isPost) {
      return false;
    }
    const id = this.post('id');
    const name = this.post('name');
    await this.model('category').where({id:id}).update({name:name});
    return this.success();
  }

  async destroyAction() {
    const id = this.post('id');
    await this.model('category').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }
};
