/**
 * @class Ext.util.MixedCollection
 * 一个负责维护数字下标（numeric indexes）和键值（key）的集合类，并暴露了一些事件。
 * @constructor
 * @param {Boolean} allowFunctions True表示为允许加入函数的引用到集合内（默认为false）
 * @param {Function} keyFn 对于一个在该Mixed集合中已保存类型的item，可用这个函数返回对应item的键值。
 * 执行MixedCollection方法时不需要特定传入一个key参数便可查找出键值。传入这个参数等同于实现了{@link #getKey}方法。
 */
Ext.util.MixedCollection = function(allowFunctions, keyFn){
    this.items = [];
    this.map = {};
    this.keys = [];
    this.length = 0;
    this.addEvents(
        /**
         * @event clear
         * 当集合被清除后触发。
         */
        "clear",
        /**
         * @event add
         * 当item被加入到集合之后触发。
         * @param {Number} index 加入item的索引
         * @param {Object} o 加入的item
         * @param {String} key 加入item的键名称
         */
        "add",
        /**
         * @event replace
         * 集合中的item被替换后触发。
         * @param {String} key 新加入item的键名称
         * @param {Object} old 被替换之item
         * @param {Object} new 新item.
         */
        "replace",
        /**
         * @event remove
         * 当item被移除集合时触发。
         * @param {Object} o 被移除的item
         * @param {String} key （可选的）被移除的item的键名称
         */
        "remove",
        "sort"
    );
    this.allowFunctions = allowFunctions === true;
    if(keyFn){
        this.getKey = keyFn;
    }
    Ext.util.MixedCollection.superclass.constructor.call(this);
};

Ext.extend(Ext.util.MixedCollection, Ext.util.Observable, {
    allowFunctions : false,

/**
 * 加入一个item到集合中。
 * @param {String} key item的键名称
 * @param {Object} o 加入的item
 * @return {Object} 已加入的item
 */
    add : function(key, o){
        if(arguments.length == 1){
            o = arguments[0];
            key = this.getKey(o);
        }
        if(typeof key == "undefined" || key === null){
            this.length++;
            this.items.push(o);
            this.keys.push(null);
        }else{
            var old = this.map[key];
            if(old){
                return this.replace(key, o);
            }
            this.length++;
            this.items.push(o);
            this.map[key] = o;
            this.keys.push(key);
        }
        this.fireEvent("add", this.length-1, o, key);
        return o;
    },

/**
  * 如果你执行getKey的方法，MixedCollection有一个通用的方法来取得keys。
  * 默认的实现只是简单地返回<tt style="font-weight:bold;">item.id</tt>，
  * 不过你可以按照下面的例子自定义一个实现，以返回另外一个值 
<pre><code>
// 一般方式
var mc = new Ext.util.MixedCollection();
mc.add(someEl.dom.id, someEl);
mc.add(otherEl.dom.id, otherEl);
//等等

// 使用getKey
var mc = new Ext.util.MixedCollection();
mc.getKey = function(el){
   return el.dom.id;
};
mc.add(someEl);
mc.add(otherEl);

// 或通过构造器
var mc = new Ext.util.MixedCollection(false, function(el){
   return el.dom.id;
});
mc.add(someEl);
mc.add(otherEl);
</code></pre>
 * @param o {Object} 根据item找到key
 * @return {Object} 传入item的key
 */
    getKey : function(o){
         return o.id;
    },

/**
 * 替换集合中的item。完成后触发{@link #replace}事件。
 * @param {String} key 要替换item所关联的那个key，或是item。
 * @param o {Object} o （可选的）如果传入的第一个参数是key，那么item就是key的键名称。
 * @return {Object}  新的item。
 */
    replace : function(key, o){
        if(arguments.length == 1){
            o = arguments[0];
            key = this.getKey(o);
        }
        var old = this.item(key);
        if(typeof key == "undefined" || key === null || typeof old == "undefined"){
             return this.add(key, o);
        }
        var index = this.indexOfKey(key);
        this.items[index] = o;
        this.map[key] = o;
        this.fireEvent("replace", key, old, o);
        return o;
    },

/**
 * 将数组中或是对象中的所有元素加入到集合中。
 * @param {Object/Array} objs 对象中包含的所有属性，或是数组中所有的值，都分别逐一加入集合中。
 */
    addAll : function(objs){
        if(arguments.length > 1 || objs instanceof Array){
            var args = arguments.length > 1 ? arguments : objs;
            for(var i = 0, len = args.length; i < len; i++){
                this.add(args[i]);
            }
        }else{
            for(var key in objs){
                if(this.allowFunctions || typeof objs[key] != "function"){
                    this.add(key, objs[key]);
                }
            }
        }
    },

/**
 * 在集合中执行每个Item的指定函数。函数执行时，会有下列的参数：
 * <div class="mdetail-params"><ul>
 * <li><b>item</b> : Mixed<p class="sub-desc">集合中的item</p></li>
 * <li><b>index</b> : Number<p class="sub-desc">item的索引</p></li>
 * <li><b>length</b> : Number<p class="sub-desc">集合中的items的总数</p></li>
 * </ul></div>
 * 那个函数应该要返回一个布尔值。若函数返回false便终止枚举。
 * @param {Function} fn 每个item要执行的函数
 * @param {Object} scope (optional) 函数执行时的作用域
 */
    each : function(fn, scope){
        var items = [].concat(this.items); // each safe for removal
        for(var i = 0, len = items.length; i < len; i++){
            if(fn.call(scope || items[i], items[i], i, len) === false){
                break;
            }
        }
    },
/**
 * 传入一个函数类型的参数，然后在集合中的每个Item执行。key和其相关的item都作为头两个参数传入。
 * @param {Function} fn 每个item要执行的函数。
 * @param {Object} scope （可选的）执行函数的作用域
 */
    eachKey : function(fn, scope){
        for(var i = 0, len = this.keys.length; i < len; i++){
            fn.call(scope || window, this.keys[i], this.items[i], i, len);
        }
    },

	/**
	 * 根据传入的函数，执行该函数若返回true便说明这是要找到的那个item。
	 * @param {Function} fn 每个item要执行的查询函数。
	 * @param {Object} scope （可选的）执行函数的作用域
	 * @return {Object} 根据规则函数在集合中第一个找到的item
	 */
    find : function(fn, scope){
        for(var i = 0, len = this.items.length; i < len; i++){
            if(fn.call(scope || window, this.items[i], this.keys[i])){
                return this.items[i];
            }
        }
        return null;
    },

/**
 * 指定集合中的某个索引然后插入一个Item
 * @param {Number} index 要插入item的索引。
 * @param {String} key 包含新item的key名称，或item本身
 * @param {Object} o   (可选的) 如果第二个参数是key,新item
 * @return {Object}以插入的item
 */
    insert : function(index, key, o){
        if(arguments.length == 2){
            o = arguments[1];
            key = this.getKey(o);
        }
        if(index >= this.length){
            return this.add(key, o);
        }
        this.length++;
        this.items.splice(index, 0, o);
        if(typeof key != "undefined" && key != null){
            this.map[key] = o;
        }
        this.keys.splice(index, 0, key);
        this.fireEvent("add", index, o, key);
        return o;
    },

/**
 * 从集合中移除Item
 * @param {Object} o 移除的item
 * @return {Object} 被移除的Item
 */
    remove : function(o){
        return this.removeAt(this.indexOf(o));
    },

/**
 * 从集合中移除由index指定的Item。完成后触发{@link #remove}事件。
 * @param {Number} index 移除item的索引
 * @return {Object} 被移除的item或是false就代表没有移除。
 */
    removeAt : function(index){
        if(index < this.length && index >= 0){
            this.length--;
            var o = this.items[index];
            this.items.splice(index, 1);
            var key = this.keys[index];
            if(typeof key != "undefined"){
                delete this.map[key];
            }
            this.keys.splice(index, 1);
            this.fireEvent("remove", o, key);
            return o;
        }
        return false;
    },
/**
 * 根据传入参数key，从集合中移除相关的item
 * @param {String} key 要移除item的key
 * @return {Object} 被移除的item或是false就代表没有移除。
 */
    removeKey : function(key){
        return this.removeAt(this.indexOfKey(key));
    },

/**
 * 返回集合中的item总数。
 * @return {Number} item总数
 */
    getCount : function(){
        return this.length;
    },

/**
 * 传入一个对象，返回它的索引。
 * @param {Object} o 要寻找索引的item
 * @return {Number} item的索引。返回－1表示找不到。
 */
    indexOf : function(o){
        return this.items.indexOf(o);
    },

/**
 * 传入一个Key，返回它的索引。
 * @param {String} key 寻找索引的key
 * @return {Number}  key的索引
 */
    indexOfKey : function(key){
        return this.keys.indexOf(key);
    },
    
/**
 * 根据key或索引（index）返回item。key的优先权高于索引。
 * 这个方法相当于先调用{@link #key}，如不匹配在调用{@link #itemAt}。
 * @param {String/Number} key或者是item的索引
 * @return {Object} 传入key所关联的item
 */
    item : function(key){
        var item = typeof this.map[key] != "undefined" ? this.map[key] : this.items[key];
        return typeof item != 'function' || this.allowFunctions ? item : null; // for prototype!
    },

/**
 * 根据索引找到item
 * @param {Number} index item的索引index
 * @return {Object} 指定索引的item
 */
    itemAt : function(index){
        return this.items[index];
    },

/**
  * 根据key找到item
 * @param {String/Number} key item的key
 * @return {Object} key所关联的item
 */
    key : function(key){
        return this.map[key];
    },

/**
 * 若在集合中找到传入的item，则返回true。
 * @param {Object} o  要在集合中查找的对象
 * @return {Boolean} True表示为在集合中找到该item
 */
    contains : function(o){
        return this.indexOf(o) != -1;
    },

/**
 * 若在集合中找到传入的key，则返回true。
 * @param {Object} o  要在集合中查找的对象
 * @return {Boolean} True表示为在集合中找到该key
 */
    containsKey : function(key){
        return typeof this.map[key] != "undefined";
    },

/**
 * 清除集合中所有item
 */
    clear : function(){
        this.length = 0;
        this.items = [];
        this.keys = [];
        this.map = {};
        this.fireEvent("clear");
    },

/**
 * 返回集合中第一个item
 * @return {Object} 集合中第一个item
 */
    first : function(){
        return this.items[0];
    },

/**
 * 返回集合中最后一个item
 * @return {Object} 集合中最后一个item
 */
    last : function(){
        return this.items[this.length-1];
    },

    // private
    _sort : function(property, dir, fn){
        var dsc = String(dir).toUpperCase() == "DESC" ? -1 : 1;
        fn = fn || function(a, b){
            return a-b;
        };
        var c = [], k = this.keys, items = this.items;
        for(var i = 0, len = items.length; i < len; i++){
            c[c.length] = {key: k[i], value: items[i], index: i};
        }
        c.sort(function(a, b){
            var v = fn(a[property], b[property]) * dsc;
            if(v == 0){
                v = (a.index < b.index ? -1 : 1);
            }
            return v;
        });
        for(var i = 0, len = c.length; i < len; i++){
            items[i] = c[i].value;
            k[i] = c[i].key;
        }
        this.fireEvent("sort", this);
    },

    /**
     * 按传入的函数排列集合
     * @param {String} 方向（可选的） "ASC" 或 "DESC"
     * @param {Function} fn（可选的） 一个供参照的function
     */
    sort : function(dir, fn){
        this._sort("value", dir, fn);
    },

    /**
     * 按key顺序排列集合
     * @param {String} 方向（可选的） "ASC" 或 "DESC"
     * @param {Function} fn（可选的） 一个参照的function (默认为非敏感字符串)
     */
    keySort : function(dir, fn){
        this._sort("key", dir, fn || function(a, b){
            var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        });
    },

    /**
     * 返回这个集合中的某个范围内的items
     * @param {Number} startIndex （可选的） 默认为 0
     * @param {Number} endIndex （可选的） 默认为最后的item
     * @return {Array} items数组
     */
    getRange : function(start, end){
        var items = this.items;
        if(items.length < 1){
            return [];
        }
        start = start || 0;
        end = Math.min(typeof end == "undefined" ? this.length-1 : end, this.length-1);
        var r = [];
        if(start <= end){
            for(var i = start; i <= end; i++) {
        	    r[r.length] = items[i];
            }
        }else{
            for(var i = start; i >= end; i--) {
        	    r[r.length] = items[i];
            }
        }
        return r;
    },
    /**
     * 由指定的属性过滤集合中的<i>对象</i>。
     * 返回以过滤后的新集合
     * @param {String} property  你对象身上的属性
     * @param {String/RegExp} value 也可以是属性开始的值或对于这个属性的正则表达式
     * @param {Boolean} anyMatch (optional) True to match any part of the string, not just the beginning
     * @param {Boolean} caseSensitive (optional) True for case sensitive comparison (defaults to False).
     * @return {MixedCollection} 过滤后的新对象
     */
    filter : function(property, value, anyMatch, caseSensitive){
        if(Ext.isEmpty(value, false)){
            return this.clone();
        }
        value = this.createValueMatcher(value, anyMatch, caseSensitive);
        return this.filterBy(function(o){
            return o && value.test(o[property]);
        });
	},
    /**
     * 由函数过滤集合中的<i>对象</i>。
     * 返回以过滤后的<i>新</i>集合
     * 传入的函数会被集合中每个对象执行。如果函数返回true，则value会被包含否则会被过滤、
     * @param {Function} fn  被调用的函数，会接收o(object)和k (the key)参数
     * @param {Object} scope （可选的）函数的作用域（默认为 this）
     * @return {MixedCollection} 过滤后的新对象
     */
    filterBy : function(fn, scope){
        var r = new Ext.util.MixedCollection();
        r.getKey = this.getKey;
        var k = this.keys, it = this.items;
        for(var i = 0, len = it.length; i < len; i++){
            if(fn.call(scope||this, it[i], k[i])){
				r.add(k[i], it[i]);
			}
        }
        return r;
    },
    /**
     * 由指定的属性/值查找集合中的第一个匹配对象。
     * 这个对象是过滤后的<i>新</i>集合
     * @param {String} property 当前对象下的属性名称
     * @param {String/RegExp} value 代表属性值的字符串，也可以是一个正则表达式以测试属性。y.
     * @param {Number} start （可选的）从第几个字符开始搜索（默认为0）
     * @param {Boolean} anyMatch （可选的）True表示为匹配字符串的任意一部分，不只是开始的部分
     * @param {Boolean} caseSensitive （可选的）True表示为打开大小写敏感
     * @return {Number} 匹配的索引或-1
     */
    findIndex : function(property, value, start, anyMatch, caseSensitive){
        if(Ext.isEmpty(value, false)){
            return -1;
        }
        value = this.createValueMatcher(value, anyMatch, caseSensitive);
        return this.findIndexBy(function(o){
            return o && value.test(o[property]);
        }, null, start);
	},
    /**
     * 由函数过滤集合中的<i>对象</i>。
     * 返回以过滤后的<i>新</i>集合
     * 传入的函数会被集合中每个对象执行。如果函数返回true，则value会被包含否则会被过滤、
     * @param {Function} fn  被调用的函数，会接收o(object)和k (the key)参数
     * @param {Object} scope （可选的）函数的作用域（默认为 this）
     * @param {Number} start （可选的）从第几个字符开始搜索（默认为0）
     * @return {MixedCollection} 匹配的索引或-1
     */
    findIndexBy : function(fn, scope, start){
        var k = this.keys, it = this.items;
        for(var i = (start||0), len = it.length; i < len; i++){
            if(fn.call(scope||this, it[i], k[i])){
				return i;
            }
        }
        if(typeof start == 'number' && start > 0){
            for(var i = 0; i < start; i++){
                if(fn.call(scope||this, it[i], k[i])){
                    return i;
                }
            }
        }
        return -1;
    },

    // private
    createValueMatcher : function(value, anyMatch, caseSensitive){
        if(!value.exec){ // not a regex
            value = String(value);
            value = new RegExp((anyMatch === true ? '' : '^') + Ext.escapeRe(value), caseSensitive ? '' : 'i');
        }
        return value;
    },

    /**
     * 创建该集合的浅表副本shallow copy（shallow copy）
     * @return {MixedCollection}
     */
    clone : function(){
        var r = new Ext.util.MixedCollection();
        var k = this.keys, it = this.items;
        for(var i = 0, len = it.length; i < len; i++){
            r.add(k[i], it[i]);
        }
        r.getKey = this.getKey;
        return r;
    }
});
/**
 * 根据key或索引返回item。key的优先权高于索引。
 * @method
 * @param {String/Number} key 或者是item的索引
 * @return {Object} 传入key所关联的item
 */
Ext.util.MixedCollection.prototype.get = Ext.util.MixedCollection.prototype.item;