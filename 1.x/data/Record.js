/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
* @class Ext.data.Record
 * Instances of this class encapsulate both record <em>definition</em> information, and record
 * <em>value</em> information for use in {@link Ext.data.Store} objects, or any code which needs
 * to access Records cached in an {@link Ext.data.Store} object.<br>
 * <p>
 * Constructors for this class are generated by passing an Array of field definition objects to {@link #create}.
 * Instances are usually only created by {@link Ext.data.Reader} implementations when processing unformatted data
 * objects.<br>
 * <p>
 * Record objects generated by this constructor inherit all the methods of Ext.data.Record listed below.
 * @constructor
 * This constructor should not be used to create Record objects. Instead, use the constructor generated by
 * {@link #create}. The parameters are the same.
 * @param {Array} data An associative Array of data values keyed by the field name.
 * @param {Object} id (Optional) The id of the record. This id should be unique, and is used by the
 * {@link Ext.data.Store} object which owns the Record to index its collection of Records. If
 * not specified an integer id is generated.
 */
 /**
* @Ext.data.Record 类
 * 该类的实例包含了Record的定义信息和（在Ext.data.Store对象里使用的，或在Ext.data.Store对象里的其它任何代码需要访问Records缓存的）值信息<br>
 * <p>
 * 传入的字段定义对象数组生成该类的构建器,当Ext.data.Reader的实现例处理未格式化数据对象时创建了实例<br>
 * <p>
 * 通过该构建器生成的Record继承了所有如下列出的Ext.data.Record方法.
 * @构建器
 * 该构建器不能被用来创建Record对象。取而代之的，是用create 方法生成的构建器。参数都是一样的！
 * @param {Array} data 数据值与字段名对应的联合数组.
 * @param {Object} id (可选项)  记录的标识.该标识应当是独一无二的。能被Ext.data.Store对象使用的，Ext.data.Store有Record标识它的records集合，
 * 如果没有指定将自动生成
 */
Ext.data.Record = function(data, id){
    this.id = (id || id === 0) ? id : ++Ext.data.Record.AUTO_ID;
    this.data = data;
};

/**
 * Generate a constructor for a specific record layout.
 * @param {Array} o An Array of field definition objects which specify field names, and optionally,
 * data types, and a mapping for an {@link Ext.data.Reader} to extract the field's value from a data object.
 * Each field definition object may contain the following properties: <ul>
 * <li><b>name</b> : String<p style="margin-left:1em">The name by which the field is referenced within the Record. This is referenced by,
 * for example the <em>dataIndex</em> property in column definition objects passed to {@link Ext.grid.ColumnModel}</p></li>
 * <li><b>mapping</b> : String<p style="margin-left:1em">(Optional) A path specification for use by the {@link Ext.data.Reader} implementation
 * that is creating the Record to access the data value from the data object. If an {@link Ext.data.JsonReader}
 * is being used, then this is a string containing the javascript expression to reference the data relative to 
 * the record item's root. If an {@link Ext.data.XmlReader} is being used, this is an {@link Ext.DomQuery} path
 * to the data item relative to the record element. If the mapping expression is the same as the field name,
 * this may be omitted.</p></li>
  * 为指定的record布局生成一构建器
 * @param {Array} o 一字段定义对象的数组，其指定了字段名，随意的数据类型。及Ext.dataReader从一数据对象选取字段值的映射。
 * 每一个字段字义对象可以包含下列属性: <ul>
 * <li><b>name</b> : String<p style="margin-left:1em">一个名字（通过该名字，在record中引用字段）. 
 * 如例  <em>dataIndex</em> 属性 在列定义对象中传到 Ext.grid.ColumnModel</p></li>
 * <li><b>mapping</b> : String<p style="margin-left:1em">(可选项)  Ext.data.Reader的实现使用的路径规范，它创建Record来访问数据对象中的数据值
 * 如果一Ext.data.JsonReader被使用，那么该字符串包含javascript 表达式来引用record条目的根与数据的关系
 * 如果使用Ext.data.XmlReader, 这将是个数据条目与记录对象关系的Ext.DomQuery路径，如果映射表达式与字段名相同。则可省略</p></li>
 * <li><b>type</b> : String<p style="margin-left:1em">(可选项) 转换成显示值的数据类型. 可能的值是
 * <ul><li>auto (默认情况下不作转换)</li>
 * <li>string</li>
 * <li>int</li>
 * <li>float</li>
 * <li>boolean</li>
 * <li>date</li></ul></p></li>
 * <li><b>sortType</b> : Mixed<p style="margin-left:1em">(可选项) Ext.data.SortTypes的数值</p></li>
 * <li><b>sortDir</b> : String<p style="margin-left:1em">(可选项) 初始化排序方向 "ASC" or "DESC"</p></li>
 * <li><b>convert</b> : Function<p style="margin-left:1em">(可选项)一个函数用来转换由reader提供的值成一个将被存入Reader中的对象，
 * 它将有如下参数被传入:<ul>
 * <li><b>v</b> : Mixed<p style="margin-left:1em">被Reader读取的数值.</p></li>
 * </ul></p></li>
 * <li><b>dateFormat</b> : String<p style="margin-left:1em">(可选项)  Date.parseDate函数的一格式.</p></li>
 * </ul>
 * <br>usage:<br><pre><code>
var TopicRecord = Ext.data.Record.create(
    {name: 'title', mapping: 'topic_title'},
    {name: 'author', mapping: 'username'},
    {name: 'totalPosts', mapping: 'topic_replies', type: 'int'},
    {name: 'lastPost', mapping: 'post_time', type: 'date'},
    {name: 'lastPoster', mapping: 'user2'},
    {name: 'excerpt', mapping: 'post_text'}
);

var myNewRecord = new TopicRecord({
    title: 'Do my job please',
    author: 'noobie',
    totalPosts: 1,
    lastPost: new Date(),
    lastPoster: 'Animal',
    excerpt: 'No way dude!'
});
myStore.add(myNewRecord);
</code></pre>
 * @method create
 * @static
 */
Ext.data.Record.create = function(o){
    var f = function(){
        f.superclass.constructor.apply(this, arguments);
    };
    Ext.extend(f, Ext.data.Record);
    var p = f.prototype;
    p.fields = new Ext.util.MixedCollection(false, function(field){
        return field.name;
    });
    for(var i = 0, len = o.length; i < len; i++){
        p.fields.add(new Ext.data.Field(o[i]));
    }
    f.getField = function(name){
        return p.fields.get(name);  
    };
    return f;
};

Ext.data.Record.AUTO_ID = 1000;
Ext.data.Record.EDIT = 'edit';
Ext.data.Record.REJECT = 'reject';
Ext.data.Record.COMMIT = 'commit';

Ext.data.Record.prototype = {
    /**
     * Readonly flag - true if this record has been modified.
     * @type Boolean
     */
	 /**
     * 只读（是否为脏数据标）志 - 如果数据被修改。则为treu.
     * @type Boolean
     */
    dirty : false,
    editing : false,
    error: null,
    modified: null,

    // private
    join : function(store){
        this.store = store;
    },

    /**
     * Set the named field to the specified value.
     * @param {String} name The name of the field to set.
     * @param {Object} value The value to set the field to.
     */
	 /**
     * 设置命名的字段为指定的指
     * @param {String} name 要设置值的字段名
     * @param {Object} value 要设置的值
     */
    set : function(name, value){
        if(this.data[name] == value){
            return;
        }
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(typeof this.modified[name] == 'undefined'){
            this.modified[name] = this.data[name];
        }
        this.data[name] = value;
        if(!this.editing){
            this.store.afterEdit(this);
        }       
    },

    /**
     * Get the value of the named field.
     * @param {String} name The name of the field to get the value of.
     * @return {Object} The value of the field.
     */
	 /**
     * 获取指字名字的字段的值
     * @param {String} name 指字要获取值的字段的名字
     * @return {Object} 字段的值
     */
    get : function(name){
        return this.data[name]; 
    },

    // private
    beginEdit : function(){
        this.editing = true;
        this.modified = {}; 
    },

    // private
    cancelEdit : function(){
        this.editing = false;
        delete this.modified;
    },

    // private
    endEdit : function(){
        this.editing = false;
        if(this.dirty && this.store){
            this.store.afterEdit(this);
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the Record.
     * Rejects all changes made to the Record since either creation, or the last commit operation.
     * Modified fields are reverted to their original values.
     * <p>
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified
     * of reject operations.
     */
	 /**
     * 通常地被 Ext.data.Store调用，其拥有Record.
     * 在record自创建或最后一次提交操作之后。拒绝所有的修改。
	 * 修改的字段被恢复到他们原始值。  
     * <p>
     * 开发者应当订阅 Ext.data.Store的update事件。使得他们用代码来执行记录事拒绝操作
     */
    reject : function(){
        var m = this.modified;
        for(var n in m){
            if(typeof m[n] != "function"){
                this.data[n] = m[n];
            }
        }
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store){
            this.store.afterReject(this);
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the Record.
     * Commits all changes made to the Record since either creation, or the last commit operation.
     * <p>
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified
     * of commit operations.
     */
	 /**
     * 通常地被 Ext.data.Store调用，其拥有Record.
     * 在record自创建或最后一次提交操作之后。提交所有的修改。
	 * 修改的字段被恢复到他们原始值。  
     * <p>
     * 开发者应当订阅 Ext.data.Store的update事件。使得他们用代码来执行记录事拒绝操作
     */
    commit : function(){
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store){
            this.store.afterCommit(this);
        }
    },

    // private
    hasError : function(){
        return this.error != null;
    },

    // private
    clearError : function(){
        this.error = null;
    },

    /**
     * Creates a copy of this record.
     * @param {String} id (optional) A new record id if you don't want to use this record's id
     * @return {Record}
     */
	 /**
     * 创建该record的副本
     * @param {String} id (可选项) 如果你不想用该record的标识，可以用个新的标识
     * @return {Record}
     */
    copy : function(newId) {
        return new this.constructor(Ext.apply({}, this.data), newId || this.id);
    }
};