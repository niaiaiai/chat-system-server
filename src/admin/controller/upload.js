const Base = require('./base.js');
const fs = require('fs');

module.exports = class extends Base {
  async brandPicAction() {
    const brandFile = this.file('pic');
    if (think.isEmpty(brandFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/static/default/' + think.uuid(32) + '.jpg';
    const is = fs.createReadStream(brandFile.path);
    const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'pic',
      fileUrl: 'http://127.0.0.1:8360' + filename
    });
  }

  async appendDirAction() {
    if (!this.isPost) {
      return false;
    }
    const folderTitle = this.post('folderTitle')
    fs.mkdir(think.ROOT_PATH + '/www/static/default' + folderTitle,function(err){
      if(err)
        return this.fail(err)
      return this.success();
    })
  }

  async readFloderAction() {
    if (!this.isPost) {
      return false;
    }
    let Files = []
    const dir = this.post('dir')
    let stat = 0
    const files = fs.readdirSync(think.ROOT_PATH + '/www/static/default' + dir)
    for(var i=0; i<files.length; i++) {
      if(fs.statSync(think.ROOT_PATH + '/www/static/default' + dir + '/' + files[i]).isDirectory()) {
        const f = fs.readdirSync(think.ROOT_PATH + '/www/static/default' + dir + '/' + files[i])
        if(!think.isEmpty(f)) {
          for(var j=0; j<f.length&&fs.statSync(think.ROOT_PATH + '/www/static/default' + dir + '/' + files[i] + '/' + f[j]).isDirectory(); j++) {
            Files.push({ title: files[i], expand: false, children: [{}]})
            stat = 1
            break
          }
          if(!stat)
            Files.push({ title: files[i], expand: false})
        }
        else {
          Files.push({ title: files[i], expand: false})
        }
      }
    }
    return this.success(Files)
  }

  async readPicsAction() {
    if (!this.isPost) {
      return false;
    }
    let Files = []
    const dir = this.post('dir')
    const files = fs.readdirSync(think.ROOT_PATH + '/www/static/default' + dir)
    for(var i=0; i<files.length; i++) {
      if(fs.statSync(think.ROOT_PATH + '/www/static/default' + dir + '/' + files[i]).isFile()) {
        Files.push({ name:files[i],url: 'http://127.0.0.1:8360/static/default/' + files[i],status: 'finished'})
      }
    }
    return this.success(Files)
  }

  async removePicAction() {
    if (!this.isPost) {
      return false;
    }
    const path = this.post('path')
    fs.unlinkSync(think.ROOT_PATH + '/www/static/default/' + path)
      return this.success('ok')
  }

  async renameAction() {
    if (!this.isPost) {
      return false;
    }
    const old = this.post('old')
    const newName = this.post('new')
    const path = this.post('path')
    fs.rename(think.ROOT_PATH + '/www/static/default' + path + '/' + old, think.ROOT_PATH + '/www/static/default' + path + '/' +newName)
    return this.success()
  }
};
