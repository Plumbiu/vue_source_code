(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () {
  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
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
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  // 匹配到的是分组是一个标签名， <xxx 匹配到的是开始标签的名字
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  // console.log(startTagOpen)
  // 匹配的是 </xxx> 最终匹配到的分组就是结束标签的名字
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  // console.log(endTag)
  // 第一个分组就是属性的 key value，就是分组 3/4/5
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // console.log(attribute)
  // <div> <br />
  var startTagclose = /^\s*(\/?)>/;
  // console.log(defaultTagRE)

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
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 2;
    var stack = []; // 用于存放元素的 ast 语法树对象
    var currentParent; // 指向栈中的最后一个
    var root;
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    // 最终需要利用栈性结构转换为一棵抽象语法树
    function start(tag, attrs) {
      var node = createASTElement(tag, attrs); // 创造一个 ast 节点
      if (!root) {
        // 看一下是否是空树
        root = node; // 如果为空，则当前是树的根节点
      }

      if (currentParent) {
        node.parent = currentParent; // 只赋予了 parent 属性
        currentParent.children.push(node); // parent 的 children 也许要赋值
      }

      stack.push(node);
      currentParent = node; // currentParent 为栈中的最后一个
      // console.log('开始', tag, attrs)
    }

    function chars(text) {
      text = text.replace(/\s/g, ''); // 如果空格超过 2
      // console.log('文本', text)
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }
    function end(tag) {
      // console.log('结束', tag)
      stack.pop(); // 弹出最后一个
      currentParent = stack[stack.length - 1];
    }
    // html 第一个肯定是一个 <
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      // console.log(start)
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
        // // console.log(match)
        return match;
      }
      // console.log(html)
      return false;
    }
    while (html) {
      // 如果 textEnd 为 0，说明是一个开始标签的或结束标签
      // 如果 textEnd > 0，则说明是文本的结束位置
      var textEnd = html.indexOf('<'); // 如果 indexOf 中的索引是 0，则说明是一个标签
      if (textEnd === 0) {
        var startTagMatch = parseStartTag(); // 开始标签的匹配
        if (startTagMatch) {
          // 解析到的开始标签
          // // console.log(html)
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

    return root; // 不是开始标签
  }

  function genProps(attrs) {
    var str = ''; // { name, value }
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === 'style') {
        // style:  { color: 'red' }
        var obj = {};
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        attr.value = obj;
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function gen(node) {
    console.log(node);
    if (node.type === 1) {
      return codegen(node);
    } else {
      // 文本
      var text = node.text;
      console.log('text', text);
      if (!defaultTagRE.test(text)) {
        console.log('匹配成功');
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        console.log('匹配成功');
        // _v(_s(name) + 'hello' + _(name))
        var tokens = [];
        var match;
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;
        while (match = defaultTagRE.exec(text)) {
          var index = match.index; // 匹配的位置，{{name}} hello {{age}}
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }
  function genChildren(children) {
    console.log('children', children);
    return children.map(function (child) {
      console.log('child', child);
      return gen(child);
    });
  }
  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "', ").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null').concat(ast.children.length ? ",".concat(children) : '', ")");
    return code;
  }
  function complieToFunction(template) {
    // 1. 将 template 转换为 ast 语法树
    var ast = parseHTML(template);
    // console.log(ast)
    // 2. 生成 render 方法(render 方法返回的结果就是虚拟 DOM)
    var code = codegen(ast);
    console.log(code);
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code); // 根据代码生成 render 函数
    return render;
    // function render(h) {
    //   return _c('div', { id: 'app' }, _c('div', { style: { color: 'red' } }, _v(_s(name) + 'hello'), _c('span', undefined, _v(_s(age)))))
    // }
    // console.log(template)
  }

  // h() _c()

  function createElementVNode(vm, tag, data) {
    if (data == null) {
      data = {};
    }
    var key = data.key;
    if (key) {
      delete data.key;
    }
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }

  // _v()
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  // ast 做的是语法层面的转换，他描述的是语法本身(可以描述 js css html)
  // 虚拟 DOM 是描述的 DOM 元素，可以增加一些自定义属性(描述 DOM)
  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
      // ...
    };
  }

  function createElm(vnode) {
    var tag = vnode.tag,
      data = vnode.data,
      children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      // 标签
      vnode.el = document.createElement(tag); // 这里将真实节点和虚拟节点对应起来，后续如果修改属性了

      patchProps(vnode.el, data);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function patchProps(el, props) {
    for (var key in props) {
      if (key === 'style') {
        // style { color: 'red' }
        for (var styleName in props['style']) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }
  function patch(oldVNode, vnode) {
    // 写的是初渲染流程
    console.log(oldVNode);
    var isRealElement = oldVNode.nodeType;
    if (isRealElement) {
      var elm = oldVNode; // 获取真实元素
      var parentElm = elm.parentNode; // 获取父元素
      var newElm = createElm(vnode);
      console.log('newElm', newElm);
      parentElm.insertBefore(newElm, elm.nextSibling);
      parentElm.removeChild(elm); // 删除老节点
      return newElm;
    }
  }
  function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      // patch 既有初始化功能，又有更新的功能
      // 将 vnode 转换为真实 DOM
      console.log(vnode, el);
      vm.$el = patch(el, vnode);
    };
    // _c('div', {}, ...children)
    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    // _v(text)
    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };
    Vue.prototype._render = function () {
      console.log('render', this);
      // 让 with 中的 this 指向 vm
      return this.$options.render.call(this); // 通过 ast 语法转义后生成的 render 方法
    };
  }

  function mountComponent(vm, el) {
    // 这里的 el，是通过 querySelector 处理过的
    vm.$el = el;
    // 1. 调用 render 犯法产生虚拟节点(虚拟 DOM)
    vm._update(vm._render()); // vm.$options.render -> 返回虚拟节点
    // 2. 根据虚拟 DOM 产生真实 DOM
    // 3. 插入到 el 元素中
  }

  // Vue 核心流程 
  //  1. 创建响应式数据
  //  2. 模板转换成 ast 语法树
  //  3. 将 ast 语法树转换成 render 函数
  //  4. 后续每次数据更新可以只调用 render 函数，无需再次执行 ast 转换的过程

  // render 函数会产生虚拟节点(使用响应式数据)
  // 根据生成的虚拟节点创造真实的 DOM

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
      mountComponent(vm, el); // 组件的挂载

      // 最终就可以获取 render 方法
      // script 标签引用的 vue.global.js 这个编译过程是在浏览器运行的
      // runtime 不包含模板编译，整个编译是打包的时候通过 loader 来转义 .vue 文件的，用 runtime 的时候不能使用模板 template(.vue 中的模板，因为.vue 中的模板是靠 loader 运行的)
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue); // 扩展了 init 方法
  initLifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
