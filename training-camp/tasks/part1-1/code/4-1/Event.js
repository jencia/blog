/*
  视频教程里把 resolve、reject、successCallback、failCallback 都挂载在实例属性里，
  外部使用是可以直接使用这些属性和方法的，很容易玩坏，为了解决这问题，我创建了这个类，用
  自定义事件机制来解决。
*/
class Event {
  fnList = {}
  has (symbol, name) {
    return !!(this.fnList[symbol] || {})[name];
  }
  // 用 symbol 隔离各个实例，触发 name 对应的事件，如果有带 name: 的将全部执行
  emit (symbol, name, params) {
    if (!this.fnList[symbol]) return [];

    const allName = Object.keys(this.fnList[symbol])
        .filter(v => new RegExp(`^${name}:?`).test(v));

    allName.forEach(key => this.fnList[symbol][key](params));
  }
  on (symbol, name, fn) {
    if (!this.fnList[symbol]) {
      this.fnList[symbol] = {};
    }
    this.fnList[symbol][name] = fn;
  }
  off (symbol) {
    delete this.fnList[symbol];
  }
}

module.exports = new Event();
