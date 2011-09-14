/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.TextItem
 * @extends Ext.menu.BaseItem
 * ���һ����̬�ı����˵��У�ͨ��������Ϊ���������ָ�����
 * @constructor
 * ����һ�� TextItem ����
 * @param {String} text Ҫ��ʾ���ı�
 */
Ext.menu.TextItem = function(text){
    this.text = text;
    Ext.menu.TextItem.superclass.constructor.call(this);
};

Ext.extend(Ext.menu.TextItem, Ext.menu.BaseItem, {
    /**
     * @cfg {Boolean} hideOnClick ֵΪ True ʱ�����������ذ����Ĳ˵���Ĭ��Ϊ false��
     */
    hideOnClick : false,
    /**
     * @cfg {String} itemCls �ı���ʹ�õ�Ĭ��CSS��ʽ�ࣨĬ��Ϊ "x-menu-text"��
     */
    itemCls : "x-menu-text",

    // private
    onRender : function(){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = this.text;
        this.el = s;
        Ext.menu.TextItem.superclass.onRender.apply(this, arguments);
    }
});