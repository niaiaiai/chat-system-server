const Base = require('./base.js');
const fs = require('fs')
const axios = require('axios')
var crypto = require('crypto');

const AlipaySdk = require('alipay-sdk').default;

import AlipayFormData from 'alipay-sdk/lib/form';

const formData = new AlipayFormData();
formData.setMethod('get');

const alipaySdk = new AlipaySdk({
  gateway: 'https://openapi.alipaydev.com/gateway.do',
  appId: '2016092000553852',
  privateKey: 'MIIEpAIBAAKCAQEAsR3gcgBzA6/rpgaf1gWrO+0gzFPafv8xGX7WsPIPX0J7ucySgy0d2TS53MNzOM1EPLIr0rgE1md1wMLCspOzZmhWd+qmXA2grsEuIlEv/wG4Xoza76GHNntNBq4OVDur9qH5wklsD41s9Ccf8XK0gwHuYTjYZ6us3lC+YDSr9DAXGECUoQBe3eaU/pvpru5IEhkwX4QOtVVOc0+mN42HxYEAsFIysaf9dvF5oPhredd00pxv/ftT+HWYgzIfOgYJxJvbvkkz6GJD+RRHBZjJvlRQOAIWGeedwlMTmAeGvZp93kqfBDYcfx05QQF7Y225O0jnOwtCTBFjp7Hp9gIUaQIDAQABAoIBADihv/FTuXLVXjjA53yMZXsM0C7lJPj0aeOoDceYLlgcLulywuoUk/WuiTtQd1gTMh1iLub6lflkLV+MJqro1TUKaZOAQN8wME+QT0sDwJ/+EdCRozN5530BIdjf8I74YXzDv9NinJ3Ab7UFiY4vSg6VoH4PqgpD90tCcAzc6ppx+dMhqwYFkN4VTBXlcrei7eX8Xeg2hUm1MGES5zEyF5+JIpXAd0X0hwLrFcjehStB6/QxzvCg9sAm7qKnsYGu2OjRoEG4oW04WY+/6PdXxz3v6G23pm5L++ckNG9LbI8CtKgRRJiVByUN6DTamNpClZt2EtW636O6A0IFpStamHECgYEA1svWZYgKlQC04jnp098gLGIxmtNUPT7u/+IbZ+1Gb4pkIRNm0aHFBm7+hgehA1mB4GNpbg7R9rOgyf9Lb5A606yE4i7pATSCchdXWK7qolsk4zRwngS7sSFM4itsERk4k7wnY26mOFsSGZbTVHmHAn0O7hx4TN2ne88KviYXhFUCgYEA0xeugoRAdUSbKaJPu8+EJ3osK3abYTaMsMkwhrWSt8wUHNge6KAIiBYO3shJS8lQX3lH6JqP+sbbZOIDoz8dF6E9VY835LzeVQOfClLokRbj8mZjRq3f7A2kIplukKwZpRmM3K/kwFtyAlkD5e9ec23CXlMY1iY6z4XDojQrQ8UCgYA3iXLAw8EAr7MVPyYfOvTFpQnwXy3LvCbtkFfHskjg9CZZivutvicEN9SlcPmHtS/ohauv4jMVl3I+aDzn9qHPMy8UkE58mkgUGcbizi8qlWhfOqLXqJ+i99o6LEH/1caUJDUG94gQ0DNI3H99uwJWeWFP3ZqZPUJdt7WuXoj8FQKBgQCES3Y6JAqFtB6OZEQWT4LifuYJw0a0EUzxStXXxxoRiJweS7BrWEigiTp+kwWksqFlhIv1klCj+Vbsjd17xQVFlu7qnVyJRXkNzLwy6y0IKVFozJRxam1I8m+oo4IwtztHRpEKik4R4/26zPDtfSwzqVlEZk3NgJ4hCxNFp+5phQKBgQC22aJk5+C0ThQnKhyOGTvy4vbBjj9y2/dPyDPyMGXLcZ7NUP3bU/zUM4IL+sE3F7KjcZHOG//y2JGdsf8r1+4/Xq7Z3h+GarQdIa6f+9sgkfN1aYettqdWkPMg+W27x1AGLme1FlnFbssscO5QXoqf0WGAWuBdaypJzgFlwJElrg==',
  format: 'json',
  charset: 'utf-8',
  alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsVeH7sfZNPa0iEiqe0gmWEuGkla19W9ocoW56crHnXC/XANauF5fKtjLNVqoBsHUGjU6gdA3WB/KcVFR33CASjFo2JtFGYyIGsFicEfTiPPjYs3V2b14XDpNwUkAjJf2AptMm+3oT0tXj+2cTr1tvUgNihUNHxslNyVpwKRLwGP82sU1Ym4fXICxSpdm7FrKbo3wSNy0D6uhMfSQWRiizNz6cqKTiY1aepWBvYZbRvDsuX8S83JwkgjrmuqWe3Xqd2vK2tnpsTLyF6awhIcbJxHzO7oQy9eH5NEAQg90NUsTKch0WERrN7wx1Bm1RAu4QdAyLwksbFW4V9LfmFon7wIDAQAB',
  sign_type: 'RSA2'
});

module.exports = class extends Base {
  async payAction() {
    const amount = this.post('amount')
    const subject = this.post('subject')

    let date = new Date()
    var datestr = 'yyyy-MM-dd hh:mm:ss'
    var o = {
      "M+": date.getMonth() + 1,                 //月份   
      "d+": date.getDate(),                    //日   
      "h+": date.getHours(),                   //小时   
      "m+": date.getMinutes(),                 //分   
      "s+": date.getSeconds(),                 //秒   
    };
    if (/(y+)/.test(datestr))
      datestr = datestr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(datestr))
        datestr = datestr.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

let th = this

formData.addField('returnUrl','http://192.168.10.165:9080/#/return')
formData.addField('notifyUrl', 'http://47.107.155.139:8360/api/alipay/payParams');
formData.addField('bizContent', {
  outTradeNo: date.getTime().toString(),
  productCode: 'FAST_INSTANT_TRADE_PAY',
  totalAmount: amount,
  subject: subject,
});

    try {
      const result = await alipaySdk.exec(
        'alipay.trade.page.pay',
        {}
        ,{ validateSign: true, formData:formData })

      return this.success(result)
    } catch (err) {
      return this.success(err)
    }

    // return this.success(result)
  }

  async payParamsAction() {
    const trade_status = this.post('trade_status')
    if(!trade_status)
      await this.module('order').where({id:trade_status}).select()
    return this.success('success')
  }

  async signVerifyAction() {
    const sign = this.post('sign')
    const tradeNo = this.post('tradeNo')
    const appId = this.post('appId')
    const authAppId = this.post('authAppId')
    const outTradeNo = this.post('outTradeNo')
    const sellerId = this.post('sellerId')
    const timestamp = this.post('timestamp')
    const totalAmount = this.post('totalAmount')

    

  
  
// var signature = decodeURIComponent(sign,'base64')
    // var verifier = crypto.createSign('RSA-SHA256');
    // const private_key = fs.readFileSync('./app_private_key.pem') 
    // var info = 'app_id='+appId+'&auth_app_id'+authAppId+'&charset=utf-8&method=alipay.trade.page.pay.return&out_trade_no='+outTradeNo+'&seller_id='+sellerId+'&timestamp='+timestamp+'&total_amount='+totalAmount+'&trade_no='+tradeNo+'&version=1.0';
    // verifier.update(info) 
    // var signOrder = encodeURIComponent(verifier.sign(private_key, 'base64'))
    // let result = verifier.verify('-----BEGIN PUBLIC KEY-----/nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsVeH7sfZNPa0iEiqe0gmWEuGkla19W9ocoW56crHnXC/XANauF5fKtjLNVqoBsHUGjU6gdA3WB/KcVFR33CASjFo2JtFGYyIGsFicEfTiPPjYs3V2b14XDpNwUkAjJf2AptMm+3oT0tXj+2cTr1tvUgNihUNHxslNyVpwKRLwGP82sU1Ym4fXICxSpdm7FrKbo3wSNy0D6uhMfSQWRiizNz6cqKTiY1aepWBvYZbRvDsuX8S83JwkgjrmuqWe3Xqd2vK2tnpsTLyF6awhIcbJxHzO7oQy9eH5NEAQg90NUsTKch0WERrN7wx1Bm1RAu4QdAyLwksbFW4V9LfmFon7wIDAQAB/n-----END PUBLIC KEY-----', signature, 'base64');
    //return this.success({result:result,userToken:this.ctx.state.token})
    return this.success(this.ctx.state.token)
  }
}