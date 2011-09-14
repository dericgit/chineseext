/*
 * 更新地址：http://jstang.5d6d.com/thread-715-1-1.html
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 *  http://jstang.5d6d.com/thread-90-1-2.html
 * 
 * 本翻译采用“创作共同约定、Creative Commons”。您可以自由：
 * 复制、发行、展览、表演、放映、广播或通过信息网络传播本作品
 * 创作演绎作品
 * 请遵守：
 *    署名. 您必须按照作者或者许可人指定的方式对作品进行署名。
 * # 对任何再使用或者发行，您都必须向他人清楚地展示本作品使用的许可协议条款。
 * # 如果得到著作权人的许可，您可以不受任何这些条件的限制
 * http://creativecommons.org/licenses/by/2.5/cn/
 */

/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.ColorItem
 * @extends Ext.menu.Adapter
 * һ��ͨ����װ {@link Ext.ColorPalette} ������ɵĲ˵��
 * @constructor
 * ����һ�� ColorItem ����
 * @param {Object} config ����ѡ�����
 */
Ext.menu.ColorItem = function(config){
    Ext.menu.ColorItem.superclass.constructor.call(this, new Ext.ColorPalette(config), config);
    /** The Ext.ColorPalette object @type Ext.ColorPalette */
    this.palette = this.component;
    this.relayEvents(this.palette, ["select"]);
    if(this.selectHandler){
        this.on('select', this.selectHandler, this.scope);
    }
};
Ext.extend(Ext.menu.ColorItem, Ext.menu.Adapter);