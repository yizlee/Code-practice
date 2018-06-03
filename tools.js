// 圣杯继承
var inherit = (function () {
    function F() { };
    return function (Son, Father) {
        F.prototype = Father.prototype;
        Son.prototype = new F();
        Son.prototype.constuctor = Son;
        Son.prototype.uber = Father.prototype
    }
}());


// 深度克隆
var deepClone = function (son, father) {
    var toStr = Object.prototype.toString,
        son = son || {};
    for (var prop in father) {
        if (father.hasOwnProperty(prop)) {
            if (father[prop] !== 'null' && typeof (father[prop]) == 'object') {
                if (toStr.call(father[prop]) == '[object Array]') {
                    son[prop] = []
                } else {
                    son[prop] = {}
                }
                deepClone(son[prop], father[prop])
            } else {
                son[prop] = father[prop]
            }
        }
    }
    return son;
}

// 判断类型
var type = function (targrt) {
    var template = {
        '[object Array]': 'array',
        '[object Object]': 'object',
        '[object Number]': 'number-object',
        '[object Boolean]': 'boolean-object',
        '[object String]': 'string-object'
    };
    if (targrt == null) {
        return 'null'
    } else if (typeof (targrt) == 'object') {
        var str = Object.prototype.toString.call(targrt);
        return template[str];
    } else {
        return typeof (targrt)
    }
}

// 数组去重
var arr = [1, 1, 1, 1, 2, 2, 2, 2, 1, 1];
Array.prototype.unique = function () {
    var arr = [],
        temp = {},
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) {
            temp[this[i]] = 'abc';
            arr.push(this[i]);
        }
    }
    return arr;
}


// 查找e元素的第n个元素节点
function retSibling(e, n) {
    while (e && n) {
        if (n > 0) {
            if (e.nextElementSibling) {
                e = e.nextElementSibling;
            } else {
                for (e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling);
            }
            n--;
        } else {
            if (e.previousElementSibling) {
                e = e.previousElementSibling;
            } else {
                for (e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling);
            }
            n++;
        }
    }
    return e;
}

// 父节点插入firstNode在lastNode之后 （类似于insertBefore（a，b））
Element.prototype.insertAfter = function (firstNode, lastNode) {
    var ttar = lastNode.nextElementSibling;
    if (ttar == null) {
        this.appendChild(firstNode)
    } else {
        this.insertBefore(firstNode, ttar);
    }
}

// 返回当前滚动条X和Y值 兼容ie
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

// 返回可视窗口的宽度高度
function getViewportOffset() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    } else {
        if (document.compatMode === "BackCompat") {
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        } else {
            return {
                w: document.documentElement.clientWidtn,
                h: document.documentElement.clientHeight
            }
        }
    }
}

// 获取样式  兼容ie
function getStyle(ele, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[prop];
    } else {
        return ele.currentStyle[prop]
    }
}

// 添加事件处理函数 兼容ie
function addEvent(ele, type, handle) {
    if (ele.addEventListener) {
        ele.addEventListener(type, handle, false);
    } else if (ele.attachEvent) {
        ele.attachEvent('on' + type, function () {
            handle.call(ele);
        })
    } else {
        ele['on' + type] = handle;
    }
}

// 取消冒泡 兼容ie
function stopBubble(e) {
    var e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

// 阻止默认事件 兼容ie
function cancelHandler(e) {
    var e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

// 事件源对象兼容性写法
// var targrt = event.target || event.srcElement

// 创建异步加载script脚本 调用时需要loadScript(url,function(){库中所需要调用的函数})
function loadScript(url, callback) {
    var script = document.createElement('script');
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'complete' || script.readyState == 'loaded') {
                callback()
            }
        }
    } else {
        script.onload = function () {
            callback();
        }
    }
    script.src = url;
    document.head.appendChild(script);
}

// 图片预加载
function imgload(url) {
    var oimg = new Image();
    oimg.src = url;
    oimg.onload = function () {
        document.body.appendChild(oimg)
    }
}

// 通过byclass选取dom 兼容ie
Document.prototype.getByClassName = function (className) {
    var allDomArr = Array.prototype.slice.call(document.getElementsByTagName('*'), 0),
        filterArr = [];
    allDomArr.forEach(function (ele, index) {
        var itemClassArr = dealClass(ele).split(' ');
        var len = itemClassArr.length;
        for (var i = 0; i < len; i++) {
            if (itemClassArr[i] == className) {
                filterArr.push(ele);
                break;
            }
        }
    })
    function dealClass(dom) {
        var reg = /\s+/g;
        var arrClassName = dom.className.replace(reg, ' ').trim();
        return arrClassName;
    }
    return filterArr;
}

// 缓冲运动
function move(obj, target, attr) {
    clearInterval(obj.timer);
    var speed, iCur;
    obj.timer = setInterval(function () {
        if (attr == 'opacity') {
            iCur = parseFloat(getStyle(obj, attr)) * 100;
        } else {
            iCur = parseInt(getStyle(obj, attr));
        }
        speed = (target - iCur) / 7;
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        if (iCur === target) {
            clearInterval(obj.timer);
        } else {
            if (attr == 'opacity') {
                obj.style[attr] = (iCur + speed) / 100;
            } else {
                obj.style[attr] = iCur + speed + 'px';
            }
        }
    }, 30)
}

// 弹性运动
function startMove(obj, target) {
    var speed = 40, a, u = 0.9;
    obj.timer = setInterval(function () {
        speed = speed + a;
        speed = speed * u;
        if (Math.abs(speed) <= 1 && Math.abs(target - obj.offsetLeft <= 1)) {
            clearInterval(timer);
            obj.style.left = target + 'px'
        } else {
            obj.style.left = obj.offsetLeft + speed + 'px';
        }
    }, 30)
}

// Array.prototype.myforEach = function(fn){
//     var len = this.length;
//     for(var i = 0 ;i < len;i++){
//         fn(this[i],i)
//     }
// }


// Array.prototype.myFilter = function (fn) {
//     var newarr = [];
//     var len = this.length;
//     for (i = 0; i < len; i++) {
//         if (fn(this[i], i)) {
//             var obj = {};
//             if (typeof (this[i]) == 'object') {
//                 newarr.push(deepClone(obj, this[i]))
//             } else {
//                 newarr.push(this[i])
//             }
//         }
//     }
//     return newarr;
// }

// Array.prototype.myMap = function(fn){
//     var newarr = [];
//     var len = this.length;
//     for(i=0;i<len;i++){
//         newarr.push(fn(this[i],i));
//     }
//     return newarr;
// }


// Array.prototype.myRdeuce = function(fn,init){
//     var len = this.length;
//     var pre = init;
//     var i = 0;
//     if(init === undefined){
//         pre = this[0];
//         i = 1
//     }
//     for (i;i<len;i++){
//         pre = fn(pre,thi[i],i);
//     }
//     return pre
// }Array.prototype.myFilter = function (fn) {
//     var newarr = [];
//     var len = this.length;
//     for (i = 0; i < len; i++) {
//         if (fn(this[i], i)) {
//             var obj = {};
//             if (typeof (this[i]) == 'object') {
//                 newarr.push(deepClone(obj, this[i]))
//             } else {
//                 newarr.push(this[i])
//             }
//         }
//     }
//     return newarr;
// }

// Array.prototype.myMap = function(fn){
//     var newarr = [];
//     var len = this.length;
//     for(i=0;i<len;i++){
//         newarr.push(fn(this[i],i));
//     }
//     return newarr;
// }


// Array.prototype.myRdeuce = function(fn,init){
//     var len = this.length;
//     var pre = init;
//     var i = 0;
//     if(init === undefined){
//         pre = this[0];
//         i = 1
//     }
//     for (i;i<len;i++){
//         pre = fn(pre,thi[i],i);
//     }
//     return pre
// }


// 操作Cookie的api
var manageCookie = {
    setCookie : function (name,value,time){
        documnet.cookie = name + '=' + value +';max-age='+time;
        return this;
    },
    removeCookie :function(name){
        return this.setCookie(name,'',-1);
    },
    getCookie:function(name,callback){
        var allCookieArr = document.cookie.split(';');
        for (var i = 0;i<allCookieArr.length;i++){
            var itemCookieArr = allCookieArr[i].split('=');
            if(itemCookieArr[i] == name){
                callback(itemCookieArr[i]);
                return this;
            }
        }
        callback(undefined);
        return this;
    }
}