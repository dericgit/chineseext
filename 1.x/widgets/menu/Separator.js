/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.Separator
 * @extends Ext.menu.BaseItem
 * ���һ���ָ������˵��У��������ֲ˵�����߼����顣ͨ��������ڵ��� add() ����ʱ�����ڲ˵��������ѡ����ʹ�� "-" ����ֱ�Ӵ���һ���ָ�����
 * @constructor
 * ����һ�� Separator ����
 * @param {Object} config ����ѡ�����
 */
Ext.menu.Separator = function(config){
    Ext.menu.Separator.superclass.constructor.call(this, config);
};

Ext.extend(Ext.menu.Separator, Ext.menu.BaseItem, {
    /**
     * @cfg {String} itemCls �ָ���ʹ�õ�Ĭ��CSS��ʽ�ࣨĬ��Ϊ "x-menu-sep"��
     */
    itemCls : "x-menu-sep",
    /**
     * @cfg {Boolean} hideOnClick ֵΪ True ʱ�����������ذ����Ĳ˵���Ĭ��Ϊ false��
     */
    hideOnClick : false,

    // private
    onRender : function(li){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = "&#160;";
        this.el = s;
        li.addClass("x-menu-sep-li");
        Ext.menu.Separator.superclass.onRender.apply(this, arguments);
    }
});