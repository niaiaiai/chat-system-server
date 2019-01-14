const Base = require('./base.js');
import amqp from 'amqplib/callback_api';
const socketObject = {}
let conn = ''
connectmq().then((result) => {
      conn = result
      console.log('连接上mq')
    }).catch((error) => console.log(error))

function connectmq() {
    return new Promise((resolve,reject) => {
      amqp.connect('amqp://localhost', function (err, conn) {
        if(err)
          reject(err)
        else
          resolve(conn)
       });
    })
  }
// this.websocket是指客户端的socket
// this就是this.websocket
// 所有的socket怎么得？
// 不用获得所有socket的方法是将每个连上的socket放入socketMap
// 发送数据到别的客户端可以用this.websocket.emit
module.exports = class extends Base {

  async findGroups(user_email) {
  	const data = await this.model('relationship').where({user_email:user_email,group_id:['!=',null]}).select()
  	return data
  }


  /*
    data: {
      sendObj: {
        id: 'toemail',
        data: [
        {
          fromUser: {
            user_email: '',
            user_name: '',
            avatar: '',
          },
          data: '',
          date: '',
          time: '',
          isOnline: true || false,
          }
        ]
      }
    }
  */
  async assertmq(data,to) {
    await conn.createChannel((err, channel) => {

      const q = to;

      channel.assertQueue(q, { durable: true });
      // Note: on Node 6 Buffer.from(msg) should be used
      channel.sendToQueue(q, new Buffer(JSON.stringify(data)), { persistent: true });
      console.log(data);
      channel.close()
    });
  }

  async createmqchannel() {
    return new Promise((resolve,reject) => {
      conn.createChannel((err,ch) => {
        // if(err)
        //   reject(err)
        // else
          resolve(ch)
      })
    })
  }
 
  // async consumemq() {
  //   return new Promise((resolve,reject) => {
  //     channel.consume(q, (msg) => {
  //       // console.log(JSON.parse(data.content.toString()))
  //       // msg.push(JSON.parse(data.content.toString()))
  //       resolve(msg)
  //       // channel.ack(data);
  //     }, {noAck: false});
  //   })
  // }

  async receivemq(email,channel) {
    // const channel = await this.createmqchannel()
    // if(think.isEmpty(channel))
    //   return
      const q = email
      console.log(q)
      channel.checkQueue(q)
      channel.assertQueue(q, {durable: true});
    const promise = new Promise((resolve,reject) => {
      // const msg = []
      //channel.prefetch(1)
      channel.consume(q, (data) => {
        console.log(JSON.parse(data.content.toString()))
        const sendObj = JSON.parse(data.content.toString())
        this.emit('message', {sendObj})
        // msg.push(JSON.parse(data.content.toString()))
        resolve(JSON.parse(data.content.toString()))
        // channel.ack(data);
      }, {noAck: true});
    })
    setTimeout(()=> {
      channel.close()
    },1000*10)
    //return promise
  }


  async loginAction() {
  	// 获取用户邮箱
    const email = this.wsData.email
  	console.log('user email: ' + email)

  	// 写入对象，email对应socket本身
  	Object.assign(socketObject, {[email]:this.websocket})

  	console.log(`socketId: ${this.websocket.id}连接`)
  	const groups = await this.findGroups(email)
  	groups.map((n) => {
  	  this.websocket.join(n.group_id);
  	})

  	const channel = await this.createmqchannel();
    if(think.isEmpty(channel))
      return

  	// let msg = [1]
    // while(!think.isEmpty(msg)) {
      // msg = []
      this.receivemq(email,channel)
     // console.log(think.isEmpty(msg)+'aaaaaa')
      // let sendObj = msg
      // this.emit('message', {sendObj})
    // }
    // channel.close()
    
  }

  async closeAction() {
    const emails = Object.keys(socketObject)
    const index = emails.findIndex((value) => Object.is(socketObject[value],this.websocket))
    if(index !== -1) {
      console.log(`${emails[index]}关闭`)
      Object.assign(socketObject,{[emails[index]]:undefined})
    }
  }


  async chatAction() {
  	// 要发送的信息
  	// 离线消息放入redis？
//   	const sseett = [1,2,{aa:'12'}]
//   	await think.cache('aaa', sseett);
//   	let aaa = await think.cache('aaa');
//   	console.log(aaa)
//   	sseett.push({aa:'13'})
//   	await think.cache('aaa', sseett);
// aaa = await think.cache('aaa');
  	// await think.cache('aaa').then((data)=> {
  	//   console.log(data)
  	// })
  // 	if(this.wsData.file) {
  // 	  var myArray = new ArrayBuffer(512);
	 //  var longInt8View = new Uint8Array(myArray);
	 //  for (var i=0; i< longInt8View.length; i++) {
		// longInt8View[i] = i % 255;
	 //  }
  // 	}
  	let to = ''
  	if(this.wsData.sendTo.toUser) {
  	  to = this.wsData.sendTo.toUser.email
  	  // if(socketObject[to]) {
  	  	const sendObj = {}
  	  	let data = {}
  	  	Object.assign(data,{
  	  	  isOnline: true,
  	  	  fromUser: this.wsData.fromUser,
  	  	  data: this.wsData.data,
  	  	  date: this.wsData.date,
  	  	  time: this.wsData.time,
  	  	  // file: this.wsData.file,
  	  	})
  	  	Object.assign(sendObj,{id:to},{data:data})
  	  	this.emit('message',{sendObj})
  	  	Object.assign(sendObj,{id:this.wsData.fromUser.email})
        console.log(think.isEmpty(socketObject[to]))
        if(socketObject[to] === undefined) {
          // 未在线 将数据放mq
          console.log('fang mq')
          this.assertmq(sendObj,to)
          return
        }
  	  	socketObject[to].emit('message', {sendObj} )
  	  // }
  	}
  	else {
  	  to = this.wsData.sendTo.toGroup.id
  	  // if(socketObject[to]) {
  	  	const sendObj = {}
  	  	let data = {}
  	  	Object.assign(data,{
  	  	  isOnline: 1,
  	  	  fromUser: this.wsData.fromUser,
  	  	  data: this.wsData.data,
  	  	  date: this.wsData.date,
  	  	  time: this.wsData.time,
  	  	})
  	  	Object.assign(sendObj,{id:to},{data:data})
  	  	this.ctx.app.websocket.io.in(to).emit('message', {sendObj});

        const members = await this.model('relationship').where({group_id:to}).field('user_email').select()
        members.map((n) => {
          if(think.isEmpty(socketObject[n.user_email])) {
            this.assertmq(sendObj,n.user_email)
          }
        })
  	  
  	}
  }

  async addVerifyAction() {
  	// 收到好友/群组验证
  	console.log('`${this.wsData.fromUser.email}`发出验证数据')
  	socketObject[this.wsData.toEmail].emit('getVerify', this.wsData)
  	// this.emit('getVerify', this.wsData)
  }

  async addFriendAction() {
    const id = await this.model('relationship').max('id')
    // userA 邀请方
    const userA = this.wsData.userA
    const userB = this.wsData.userB
    const a = Object.assign({},{id:id+1},{user_email:userA.email},{friend_email:userB.email})
    const b = Object.assign({},{id:id+2},{user_email:userB.email},{friend_email:userA.email})
    console.log([a,b])
    const data = await this.model('relationship').addMany([a,b])

    // 有历史记录
    // 验证信息将变为系统消息
    // const systemMessage = user
    // fs.writeFileSync
    if(data.length < 2) {
      // 回滚
      return false
    }
    // 好友成功
    // this是接受方
    const index = this.wsData.index
    const date = new Date()
    const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    this.emit('addFriendResult', Object.assign({},{fromUser:userA},{index:index},{type:3}))
    socketObject[userA.email].emit('addFriendResult', Object.assign({},{fromUser:userB},{date:dateStr},{time:timeStr},{type:0},{data:'接受了您的添加请求并添加您为好友'}))
  }

  async addGroupAction() {
  	const id = await this.model('relationship').max('id')
  	// userA 申请方
  	// userB 接受方
  	const userA = this.wsData.userA
  	const userB = this.wsData.userB
  	const group = this.wsData.group
  	const data = await this.model('relationship').add({id:id+1,user_email:userA.email,group_id:group.group_id})
  	const dataisExist = await this.model('relationship').where({id:id+1}).select()
  	console.log(dataisExist)
  	if(dataisExist.length <=0)
  	  return false

  	const index = this.wsData.index
  	const date = new Date()
    const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  	this.emit('addGroupResult', Object.assign({},{fromUser:userA},{index:index},{type:4}))
  	socketObject[userA.email].emit('addGroupResult', Object.assign({},{fromUser:userB},{group:group},{date:dateStr},{time:timeStr},{type:0},{data:'接受了您加入群的请求'}))
  	// join group
  	socketObject[userA.email].join(group.group_id);
  }

  async inviteToGroupAction() {
  	// userA 发起邀请方
  	// const userA = this.wsData.userA
  	// const userB = this.wsData.userB
  	const group = this.wsData.group

  	socketObject[group.leader].emit('getVerify',this.wsData)
  	// socketObject[group.leader].emit(...)
  }

  async acceptInviteAddToGroupLeaderAction() {
  	// userA 发起邀请方
  	const userA = this.wsData.userA
  	const userB = this.wsData.userB
  	const group = this.wsData.group
  	const index = this.wsData.index

  	
  	
  	// fromUser是邀请方
  	socketObject[group.leader].emit('inviteResult',Object.assign({},{fromUser:userA},{group:group},{index:index},{type:6}))
  	// 发给userA fromUser是userB userB接受邀请 写data
  	const date = new Date()
    const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  	socketObject[userB.friend_email].emit('inviteResult',Object.assign({},{fromUser:userA},{userB:userB},{group:group},{date:dateStr},{time:timeStr},{type:5}))
  	// join group
  	// this.websocket.join(group.id);
  }

  async acceptInviteAddToGroupAction() {
  	// userA 发起邀请方
  	const userA = this.wsData.userA
  	const userB = this.wsData.userB
  	const group = this.wsData.group
  	const index = this.wsData.index
  	console.log(userB)

  	const id = await this.model('relationship').max('id')
  	const data = await this.model('relationship').add({id:id+1,user_email:userB.friend_email,group_id:group.id})

  	socketObject[userB.friend_email].emit('inviteResult',Object.assign({},{fromUser:userA},{group:group},{index:index},{type:6}))
  	const date = new Date()
    const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  	socketObject[userA.email].emit('inviteResult',Object.assign({},{fromUser:userA},{group:group},{userB:userB},{time:timeStr},{date:dateStr},{type:7},{data:'接受了您的请求并加入群'}))
  	// join group
  	socketObject[userB.friend_email].join(group.id);
  }

  async createGroupJoinAction() {
  	const group = this.wsData
  	console.log(`进入房间${group.result[0].group_id}`)
  	this.websocket.join(group.result[0].group_id)
  }

  async removeGroupAction() {
  	const group_id = this.wsData.group.id
  	this.ctx.app.websocket.io.in(group_id).emit('removeGroup', this.wsData);
  	const members = await this.model('relationship').where({group_id:group_id}).select()
  	await members.map((n) => {
  	  if(socketObject[n.user_email])
  	  	socketObject[n.user_email].leave(group_id)
  	})
  	await this.model('relationship').where({group_id:group_id}).delete()
  	await this.model('group').where({group_id:group_id}).delete()
  }

  async leaveGroupAction() {
  	const group_id = this.wsData.group.id
  	this.websocket.leave(group_id)
  }
};
