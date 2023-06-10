(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  // 匹配到的是分组是一个标签名， <xxx 匹配到的是开始标签的名字
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  console.log(startTagOpen);
  // 匹配的是 </xxx> 最终匹配到的分组就是结束标签的名字
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  console.log(endTag);
  // 第一个分组就是属性的 key value，就是分组 3/4/5
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  console.log(attribute);
  // <div> <br />
  var startTagclose = /^\s*(\/?)>/;
  console.log(startTagclose);
  // 匹配到的内容是 {{}} 中的变量
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  console.log(defaultTagRE);

  // vue3 采用的不是正则
  // 对模板进行编译处理

  /*
    {
      tag: 'div,
      type: 1,
      attrs: [{name, age. address}],
      parent: null,
      children: []
    }


  */

  function parseHTML(html) {
    // 最终需要转换为一棵抽象语法树
    function start(tag, attrs) {
      console.log('开始', tag, attrs);
    }
    function chars(text) {
      console.log('文本', text);
    }
    function end(tag) {
      console.log('结束', tag);
    }
    // html 第一个肯定是一个 <
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      console.log(start);
      if (start) {
        var match = {
          tagName: start[1],
          // 标签名
          attrs: []
        };
        advance(start[0].length);
        // 如果不是开始标签的结束，就一直匹配下去
        var attr, _end;
        while (!(_end = html.match(startTagclose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
        }
        if (_end) {
          advance(_end[0].length);
        }
        // console.log(match)
        return match;
      }
      console.log(html);
      return false; // 不是开始标签
    }

    while (html) {
      // 如果 textEnd 为 0，说明是一个开始标签的或结束标签
      // 如果 textEnd > 0，则说明是文本的结束位置
      var textEnd = html.indexOf('<'); // 如果 indexOf 中的索引是 0，则说明是一个标签
      if (textEnd === 0) {
        var startTagMatch = parseStartTag(); // 开始标签的匹配
        if (startTagMatch) {
          // 解析到的开始标签
          // console.log(html)
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      if (textEnd > 0) {
        var text = html.substring(0, textEnd); // 文本内容
        if (text) {
          chars(text);
          advance(text.length); // 解析到的文本
        }
      }
    }

    console.log(html);
  }
  function complieToFunction(template) {
    // 1. 将 template 转换为 ast 语法树
    parseHTML(template);
    // 2. 生成 render 方法(render 方法返回的结果就是虚拟 DOM)

    // console.log(template)
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  // 对数组重写数组中的部分方法（能够修改数组本身）
  var oldArrayProto = Array.prototype; // 获取数组的原型

  // newArrayProto.__proto__ = oldArrayProto
  var newArrayProto = Object.create(oldArrayProto);
  var methods = [
  // 找到所有可以修改数组本身的方法
  'push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // concat、slice 等方法都不会改变原数组

  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // 重写了数组的方法
      // push()
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 内部调用原来的方法
      console.log('method', method);
      // 我们需要对新增的数据再次进行劫持
      var inserted;
      var ob = this.__ob__;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      console.log(inserted); // 新增的内容
      if (inserted) {
        ob.observeArray(inserted);
      }
      // 我们需要对新增的数据再次进行劫持
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      // data.__ob__ = this // 给数据加了一个标识，如果数据上有 __ob__，则说明这个属性被观测过，！！！此写法会死循环！！！
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      }); // 改成不可枚举
      // Object.definePropetry 只能劫持已经存在的属性，后增或者删除的不可以
      if (Array.isArray(data)) {
        // 重写数组中的方法，7个可以直接修改数组本身的方法
        data.__proto__ = newArrayProto; // 保留数组原有的特性，并且可以重写部分方法
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 循环对象，对属性依次劫持
        // "重新定义"属性，性能比较差
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
    return Observer;
  }();
  function defineReactive(target, key, value) {
    observe(value); // 对所有的对象都进行属性劫持
    // 闭包
    Object.defineProperty(target, key, {
      get: function get() {
        console.log('用户取值了');
        // 取值的时候，会执行get
        return value;
      },
      set: function set(newValue) {
        // 修改的时候，会执行set
        console.log('用户设置值了');
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || data == null) {
      return; // 只对对象进行劫持
    }

    if (data.__ob__ instanceof Observer) {
      // 说明这个对象被代理过了
      return data.__ob__;
    }
    // 如果一个对象被劫持，那就不需要再被劫持了(要判断一个对象是否被劫持过，可以增添实例，用实例判断是否被劫持过)
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // 获取所有的选项
    if (opts.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      // vm.name
      get: function get() {
        return vm[target][key]; // vm._data.name
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data; // data 可能是对象或者函数
    data = typeof data === 'function' ? data.call(vm) : data;
    console.log(data);
    vm._data = data;
    // 对数据进行劫持
    observe(data);
    // 将 vm._data 用 vm 来代理就可以了
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  // 给 Vue 增加 init 方法
  function initMixin(Vue) {
    // 用于初始化操作
    Vue.prototype._init = function (options) {
      // vue vm $options 就是获取用户的配置
      var vm = this;
      vm.$options = options; // 将用户的选项挂载到实例上
      // 初始化状态
      initState(vm);
      // TODO 其他操作
      if (options.el) {
        vm.$mount(options.el); // 实现数据的挂载
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var ops = vm.$options;
      if (!ops.render) {
        // 先进行查找有没有 render 函数
        var template; // 没有 render 开一下是否写了 template，没写 template 采用外部的 template
        if (!ops.template && el) {
          // 没有写模板，但是有 el
          template = el.outerHTML;
        } else {
          // 写了 template 就有，写了的 template
          if (el) {
            template = ops.template;
          }
        }
        // 写了 template 就用写了的 template
        if (template) {
          // 需要对模板进行编译
          var render = complieToFunction(template);
          ops.render = render;
        }
      }
      ops.render; // 最终就可以获取 render 方法
      // script 标签引用的 vue.global.js 这个编译过程是在浏览器运行的
      // runtime 不包含模板编译，整个编译是打包的时候通过 loader 来转义 .vue 文件的，用 runtime 的时候不能使用模板 template(.vue 中的模板，因为.vue 中的模板是靠 loader 运行的)
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue); // 扩展了 init 方法

  return Vue;

}));
//# sourceMappingURL=vue.js.map
