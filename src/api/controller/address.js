const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取用户的收货地址
   * @return {Promise} []
   */
  async listAction() {
    const addressList = await this.model('address').where({user_id: this.getLoginUserId()}).select();
    let itemKey = 0;
    for (const addressItem of addressList) {
      addressList[itemKey].province_name = await this.model('region').getRegionName(addressItem.province_id);
      addressList[itemKey].city_name = await this.model('region').getRegionName(addressItem.city_id);
      addressList[itemKey].district_name = await this.model('region').getRegionName(addressItem.district_id);
      addressList[itemKey].full_region = addressList[itemKey].province_name + addressList[itemKey].city_name + addressList[itemKey].district_name;
      itemKey += 1;
    }

    return this.success(addressList);
  }

  /**
   * 获取收货地址的详情
   * @return {Promise} []
   */
  async detailAction() {
    // const addressId = this.post('id');
    const id = this.post('id');

    const addressInfo = await this.model('address').where({user_id: id}).select();
    if (!think.isEmpty(addressInfo)) {
      for(let i=0; i<addressInfo.length; i++) {
        addressInfo[i].province_name = await this.model('region').getRegionName(addressInfo[i].province_id);
        addressInfo[i].city_name = await this.model('region').getRegionName(addressInfo[i].city_id);
        addressInfo[i].district_name = await this.model('region').getRegionName(addressInfo[i].district_id);
        addressInfo[i].full_region = addressInfo[i].province_name + addressInfo[i].city_name + addressInfo[i].district_name;
      }
    }

    return this.success(addressInfo);
  }

  /**
   * 添加或更新收货地址
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async saveAction() {
    let addressId = this.post('id');

    const addressData = {
      name: this.post('name'),
      mobile: this.post('mobile'),
      user_id: this.post('user_id'),
      province_id: this.post('province_id'),
      city_id: this.post('city_id'),
      country_id:this.post('country_id'),
      district_id: this.post('district_id'),
      address: this.post('address'),
      is_default: this.post('is_default') === true ? 1 : 0
    };

    if (think.isEmpty(addressId)) {
      addressData.id = await this.model('address').max('id')+1
      addressId = addressData.id
      await this.model('address').add(addressData);
    } else {
      await this.model('address').where({id: addressId, user_id: this.getLoginUserId()}).update(addressData);
    }

    // 如果设置为默认，则取消其它的默认
    if (this.post('is_default') === true) {
      await this.model('address').where({id: ['<>', addressId], user_id: this.getLoginUserId()}).update({
        is_default: 0
      });
    }
    const addressInfo = await this.model('address').where({id: addressId}).find();
    if (!think.isEmpty(addressInfo)) {
        addressInfo.province_name = await this.model('region').getRegionName(addressInfo.province_id);
        addressInfo.city_name = await this.model('region').getRegionName(addressInfo.city_id);
        addressInfo.district_name = await this.model('region').getRegionName(addressInfo.district_id);
        addressInfo.full_region = addressInfo.province_name + addressInfo.city_name + addressInfo.district_name;
    }

    return this.success(addressInfo);
  }

  /**
   * 删除指定的收货地址
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async deleteAction() {
    const addressId = this.post('id');

    await this.model('address').where({id: addressId, user_id: this.getLoginUserId()}).delete();

    return this.success('删除成功');
  }
};
