var _callback_api = require('amqplib/callback_api');

var _callback_api2 = _interopRequireDefault(_callback_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('./base.js');

const socketObject = {};
let conn = '';
connectmq().then(result => {
  conn = result;
  console.log('连接上mq');
}).catch(error => console.log(error));

function connectmq() {
  return new Promise((resolve, reject) => {
    _callback_api2.default.connect('amqp://localhost', function (err, conn) {
      if (err) reject(err);else resolve(conn);
    });
  });
}
// this.websocket是指客户端的socket
// this就是this.websocket
// 所有的socket怎么得？
// 不用获得所有socket的方法是将每个连上的socket放入socketMap
// 发送数据到别的客户端可以用this.websocket.emit
module.exports = class extends Base {

  findGroups(user_email) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const data = yield _this.model('relationship').where({ user_email: user_email, group_id: ['!=', null] }).select();
      return data;
    })();
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
  assertmq(data, to) {
    return _asyncToGenerator(function* () {
      yield conn.createChannel(function (err, channel) {

        const q = to;

        channel.assertQueue(q, { durable: true });
        // Note: on Node 6 Buffer.from(msg) should be used
        channel.sendToQueue(q, new Buffer(JSON.stringify(data)), { persistent: true });
        console.log(data);
        channel.close();
      });
    })();
  }

  createmqchannel() {
    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        conn.createChannel(function (err, ch) {
          // if(err)
          //   reject(err)
          // else
          resolve(ch);
        });
      });
    })();
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

  receivemq(email, channel) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      // const channel = await this.createmqchannel()
      // if(think.isEmpty(channel))
      //   return
      const q = email;
      console.log(q);
      channel.checkQueue(q);
      channel.assertQueue(q, { durable: true });
      const promise = new Promise(function (resolve, reject) {
        // const msg = []
        //channel.prefetch(1)
        channel.consume(q, function (data) {
          console.log(JSON.parse(data.content.toString()));
          const sendObj = JSON.parse(data.content.toString());
          _this2.emit('message', { sendObj });
          // msg.push(JSON.parse(data.content.toString()))
          resolve(JSON.parse(data.content.toString()));
          // channel.ack(data);
        }, { noAck: true });
      });
      setTimeout(function () {
        channel.close();
      }, 1000 * 10);
      //return promise
    })();
  }

  loginAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      // 获取用户邮箱
      const email = _this3.wsData.email;
      console.log('user email: ' + email);

      // 写入对象，email对应socket本身
      Object.assign(socketObject, { [email]: _this3.websocket });

      console.log(`socketId: ${_this3.websocket.id}连接`);
      const groups = yield _this3.findGroups(email);
      groups.map(function (n) {
        _this3.websocket.join(n.group_id);
      });

      const channel = yield _this3.createmqchannel();
      if (think.isEmpty(channel)) return;

      // let msg = [1]
      // while(!think.isEmpty(msg)) {
      // msg = []
      _this3.receivemq(email, channel);
      // console.log(think.isEmpty(msg)+'aaaaaa')
      // let sendObj = msg
      // this.emit('message', {sendObj})
      // }
      // channel.close()
    })();
  }

  closeAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const emails = Object.keys(socketObject);
      const index = emails.findIndex(function (value) {
        return Object.is(socketObject[value], _this4.websocket);
      });
      if (index !== -1) {
        console.log(`${emails[index]}关闭`);
        Object.assign(socketObject, { [emails[index]]: undefined });
      }
    })();
  }

  chatAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
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
      let to = '';
      if (_this5.wsData.sendTo.toUser) {
        to = _this5.wsData.sendTo.toUser.email;
        // if(socketObject[to]) {
        const sendObj = {};
        let data = {};
        Object.assign(data, {
          isOnline: true,
          fromUser: _this5.wsData.fromUser,
          data: _this5.wsData.data,
          date: _this5.wsData.date,
          time: _this5.wsData.time
          // file: this.wsData.file,
        });
        Object.assign(sendObj, { id: to }, { data: data });
        _this5.emit('message', { sendObj });
        Object.assign(sendObj, { id: _this5.wsData.fromUser.email });
        console.log(think.isEmpty(socketObject[to]));
        if (socketObject[to] === undefined) {
          // 未在线 将数据放mq
          console.log('fang mq');
          _this5.assertmq(sendObj, to);
          return;
        }
        socketObject[to].emit('message', { sendObj });
        // }
      } else {
        to = _this5.wsData.sendTo.toGroup.id;
        // if(socketObject[to]) {
        const sendObj = {};
        let data = {};
        Object.assign(data, {
          isOnline: 1,
          fromUser: _this5.wsData.fromUser,
          data: _this5.wsData.data,
          date: _this5.wsData.date,
          time: _this5.wsData.time
        });
        Object.assign(sendObj, { id: to }, { data: data });
        _this5.ctx.app.websocket.io.in(to).emit('message', { sendObj });

        const members = yield _this5.model('relationship').where({ group_id: to }).field('user_email').select();
        members.map(function (n) {
          if (think.isEmpty(socketObject[n.user_email])) {
            _this5.assertmq(sendObj, n.user_email);
          }
        });
      }
    })();
  }

  addVerifyAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      // 收到好友/群组验证
      console.log('`${this.wsData.fromUser.email}`发出验证数据');
      socketObject[_this6.wsData.toEmail].emit('getVerify', _this6.wsData);
      // this.emit('getVerify', this.wsData)
    })();
  }

  addFriendAction() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const id = yield _this7.model('relationship').max('id');
      // userA 邀请方
      const userA = _this7.wsData.userA;
      const userB = _this7.wsData.userB;
      const a = Object.assign({}, { id: id + 1 }, { user_email: userA.email }, { friend_email: userB.email });
      const b = Object.assign({}, { id: id + 2 }, { user_email: userB.email }, { friend_email: userA.email });
      console.log([a, b]);
      const data = yield _this7.model('relationship').addMany([a, b]);

      // 有历史记录
      // 验证信息将变为系统消息
      // const systemMessage = user
      // fs.writeFileSync
      if (data.length < 2) {
        // 回滚
        return false;
      }
      // 好友成功
      // this是接受方
      const index = _this7.wsData.index;
      const date = new Date();
      const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      _this7.emit('addFriendResult', Object.assign({}, { fromUser: userA }, { index: index }, { type: 3 }));
      socketObject[userA.email].emit('addFriendResult', Object.assign({}, { fromUser: userB }, { date: dateStr }, { time: timeStr }, { type: 0 }, { data: '接受了您的添加请求并添加您为好友' }));
    })();
  }

  addGroupAction() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const id = yield _this8.model('relationship').max('id');
      // userA 申请方
      // userB 接受方
      const userA = _this8.wsData.userA;
      const userB = _this8.wsData.userB;
      const group = _this8.wsData.group;
      const data = yield _this8.model('relationship').add({ id: id + 1, user_email: userA.email, group_id: group.group_id });
      const dataisExist = yield _this8.model('relationship').where({ id: id + 1 }).select();
      console.log(dataisExist);
      if (dataisExist.length <= 0) return false;

      const index = _this8.wsData.index;
      const date = new Date();
      const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      _this8.emit('addGroupResult', Object.assign({}, { fromUser: userA }, { index: index }, { type: 4 }));
      socketObject[userA.email].emit('addGroupResult', Object.assign({}, { fromUser: userB }, { group: group }, { date: dateStr }, { time: timeStr }, { type: 0 }, { data: '接受了您加入群的请求' }));
      // join group
      socketObject[userA.email].join(group.group_id);
    })();
  }

  inviteToGroupAction() {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      // userA 发起邀请方
      // const userA = this.wsData.userA
      // const userB = this.wsData.userB
      const group = _this9.wsData.group;

      socketObject[group.leader].emit('getVerify', _this9.wsData);
      // socketObject[group.leader].emit(...)
    })();
  }

  acceptInviteAddToGroupLeaderAction() {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      // userA 发起邀请方
      const userA = _this10.wsData.userA;
      const userB = _this10.wsData.userB;
      const group = _this10.wsData.group;
      const index = _this10.wsData.index;

      // fromUser是邀请方
      socketObject[group.leader].emit('inviteResult', Object.assign({}, { fromUser: userA }, { group: group }, { index: index }, { type: 6 }));
      // 发给userA fromUser是userB userB接受邀请 写data
      const date = new Date();
      const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      socketObject[userB.friend_email].emit('inviteResult', Object.assign({}, { fromUser: userA }, { userB: userB }, { group: group }, { date: dateStr }, { time: timeStr }, { type: 5 }));
      // join group
      // this.websocket.join(group.id);
    })();
  }

  acceptInviteAddToGroupAction() {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      // userA 发起邀请方
      const userA = _this11.wsData.userA;
      const userB = _this11.wsData.userB;
      const group = _this11.wsData.group;
      const index = _this11.wsData.index;
      console.log(userB);

      const id = yield _this11.model('relationship').max('id');
      const data = yield _this11.model('relationship').add({ id: id + 1, user_email: userB.friend_email, group_id: group.id });

      socketObject[userB.friend_email].emit('inviteResult', Object.assign({}, { fromUser: userA }, { group: group }, { index: index }, { type: 6 }));
      const date = new Date();
      const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      socketObject[userA.email].emit('inviteResult', Object.assign({}, { fromUser: userA }, { group: group }, { userB: userB }, { time: timeStr }, { date: dateStr }, { type: 7 }, { data: '接受了您的请求并加入群' }));
      // join group
      socketObject[userB.friend_email].join(group.id);
    })();
  }

  createGroupJoinAction() {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      const group = _this12.wsData;
      console.log(`进入房间${group.result[0].group_id}`);
      _this12.websocket.join(group.result[0].group_id);
    })();
  }

  removeGroupAction() {
    var _this13 = this;

    return _asyncToGenerator(function* () {
      const group_id = _this13.wsData.group.id;
      _this13.ctx.app.websocket.io.in(group_id).emit('removeGroup', _this13.wsData);
      const members = yield _this13.model('relationship').where({ group_id: group_id }).select();
      yield members.map(function (n) {
        if (socketObject[n.user_email]) socketObject[n.user_email].leave(group_id);
      });
      yield _this13.model('relationship').where({ group_id: group_id }).delete();
      yield _this13.model('group').where({ group_id: group_id }).delete();
    })();
  }

  leaveGroupAction() {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      const group_id = _this14.wsData.group.id;
      _this14.websocket.leave(group_id);
    })();
  }
};
//# sourceMappingURL=websocket.js.map