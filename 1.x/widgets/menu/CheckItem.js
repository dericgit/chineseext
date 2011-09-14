/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.CheckItem
 * @extends Ext.menu.Item
 * ���һ��Ĭ��Ϊ��ѡ��Ĳ˵�ѡ�Ҳ�����ǵ�ѡ�����е�һ����Ա��
 * @constructor
 * ����һ�� CheckItem ����
 * @param {Object} config ����ѡ�����
 */
Ext.menu.CheckItem = function(config){
    Ext.menu.CheckItem.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event beforecheckchange
         * �� checked ���Ա��趨֮ǰ�������ṩһ��ȡ���Ļ��ᣨ�����Ҫ�Ļ���
         * @param {Ext.menu.CheckItem} this
         * @param {Boolean} checked �������õ��µ� checked ����ֵ
         */
        "beforecheckchange" : true,
        /**
         * @event checkchange
         * checked ���Ա����ú󴥷�
         * @param {Ext.menu.CheckItem} this
         * @param {Boolean} checked �����õ� checked ����ֵ
         */
        "checkchange" : true
    });
    if(this.checkHandler){
        this.on('checkchange', this.checkHandler, this.scope);
    }
};
Ext.extend(Ext.menu.CheckItem, Ext.menu.Item, {
    /**
     * @cfg {String} group
     * ���� group ������ͬ��ѡ������Զ�����֯��һ����ѡ��ť���У�Ĭ��Ϊ ''��
     */
    /**
     * @cfg {String} itemCls ѡ����ʹ�õ�Ĭ��CSS��ʽ�ࣨĬ��Ϊ "x-menu-item x-menu-check-item"��
     */
    itemCls : "x-menu-item x-menu-check-item",
    /**
     * @cfg {String} groupClass ��ѡ������ѡ����ʹ�õ�Ĭ��CSS��ʽ�ࣨĬ��Ϊ "x-menu-group-item"��
     */
    groupClass : "x-menu-group-item",

    /**
     * @cfg {Boolean} checked ֵΪ True ʱ��ѡ���ʼΪѡ��״̬��Ĭ��Ϊ false����
     * ע�⣺���ѡ����Ϊ��ѡ�����е�һԱ��group Ϊ trueʱ����ֻ������ѡ����ű���ʼΪѡ��״̬��
     */
    checked: false,

    // private
    ctype: "Ext.menu.CheckItem",

    // private
    onRender : function(c){
        Ext.menu.CheckItem.superclass.onRender.apply(this, arguments);
        if(this.group){
            this.el.addClass(this.groupClass);
        }
        Ext.menu.MenuMgr.registerCheckable(this);
        if(this.checked){
            this.checked = false;
            this.setChecked(true, true);
        }
    },

    // private
    destroy : function(){
        if(this.rendered){
            Ext.menu.MenuMgr.unregisterCheckable(this);
        }
        Ext.menu.CheckItem.superclass.destroy.apply(this, arguments);
    },

    /**
     * ���ø�ѡ��� checked ����״̬
     * @param {Boolean} checked �µ� checked ����ֵ
     * @param {Boolean} suppressEvent ����ѡ� ֵΪ True ʱ����ֹ checkchange �¼��Ĵ�����Ĭ��Ϊ false��
     */
    setChecked : function(state, suppressEvent){
        if(this.checked != state && this.fireEvent("beforecheckchange", this, state) !== false){
            if(this.container){
                this.container[state ? "addClass" : "removeClass"]("x-menu-item-checked");
            }
            this.checked = state;
            if(suppressEvent !== true){
                this.fireEvent("checkchange", this, state);
            }
        }
    },

    // private
    handleClick : function(e){
       if(!this.disabled && !(this.checked && this.group)){// disable unselect on radio item
           this.setChecked(!this.checked);
       }
       Ext.menu.CheckItem.superclass.handleClick.apply(this, arguments);
    }
});