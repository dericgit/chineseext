/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.ColorMenu
 * @extends Ext.menu.Menu
 * һ������ {@link Ext.menu.ColorItem} ����Ĳ˵����ṩ�˻�������ɫѡ��������
 * @constructor
 * ����һ�� ColorMenu ����
 * @param {Object} config ����ѡ�����
 */
Ext.menu.ColorMenu = function(config){
    Ext.menu.ColorMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var ci = new Ext.menu.ColorItem(config);
    this.add(ci);
    /**
     * �ò˵��� {@link Ext.ColorPalette} ���ʵ��
     * @type ColorPalette
     */
    this.palette = ci.palette;
    /**
     * @event select
     * @param {ColorPalette} palette
     * @param {String} color
     */
    this.relayEvents(ci, ["select"]);
};
Ext.extend(Ext.menu.ColorMenu, Ext.menu.Menu);