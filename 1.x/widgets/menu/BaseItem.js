/*
 * Ext JS Library 1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

/**
 * @class Ext.menu.BaseItem
 * @extends Ext.Component
 * �˵�����а���������ѡ��Ļ��ࡣBaseItem �ṩĬ�ϵ���Ⱦ���״̬������ɲ˵��������Ļ������á�
 * @constructor
 * ����һ�� BaseItem ����
 * @param {Object} config ����ѡ�����
 */
Ext.menu.BaseItem = function(config){
    Ext.menu.BaseItem.superclass.constructor.call(this, config);

    this.addEvents({
        /**
         * @event click
         * ����ѡ����ʱ����
         * @param {Ext.menu.BaseItem} this
         * @param {Ext.EventObject} e
         */
        click: true,
        /**
         * @event activate
         * ����ѡ�����ʱ����
         * @param {Ext.menu.BaseItem} this
         */
        activate : true,
        /**
         * @event deactivate
         * ����ѡ��ͷ��ﴥ��
         * @param {Ext.menu.BaseItem} this
         */
        deactivate : true
    });

    if(this.handler){
        this.on("click", this.handler, this.scope, true);
    }
};

Ext.extend(Ext.menu.BaseItem, Ext.Component, {
    /**
     * @cfg {Function} handler
     * ���������ѡ����¼��ĺ�����Ĭ��Ϊ undefined��
     */
    /**
     * @cfg {Boolean} canActivate ֵΪ True ʱ��ѡ���ܹ��ڿɼ�������±�����
     */
    canActivate : false,
    /**
     * @cfg {String} activeClass ����ѡ���Ϊ����״̬ʱ��ʹ�õ�CSS��ʽ�ࣨĬ��Ϊ "x-menu-item-active"��
     */
    activeClass : "x-menu-item-active",
    /**
     * @cfg {Boolean} hideOnClick ֵΪ True ʱ��ѡ����������������Ĳ˵���Ĭ��Ϊ true��
     */
    hideOnClick : true,
    /**
     * @cfg {Number} hideDelay �Ժ���Ϊ��λ��ʾ�ĵ��������ص��ӳ�ʱ�䣨Ĭ��Ϊ 100��
     */
    hideDelay : 100,

    // private
    ctype: "Ext.menu.BaseItem",

    // private
    actionMode : "container",

    // private
    render : function(container, parentMenu){
        this.parentMenu = parentMenu;
        Ext.menu.BaseItem.superclass.render.call(this, container);
        this.container.menuItemId = this.id;
    },

    // private
    onRender : function(container, position){
        this.el = Ext.get(this.el);
        container.dom.appendChild(this.el.dom);
    },

    // private
    onClick : function(e){
        if(!this.disabled && this.fireEvent("click", this, e) !== false
                && this.parentMenu.fireEvent("itemclick", this, e) !== false){
            this.handleClick(e);
        }else{
            e.stopEvent();
        }
    },

    // private
    activate : function(){
        if(this.disabled){
            return false;
        }
        var li = this.container;
        li.addClass(this.activeClass);
        this.region = li.getRegion().adjust(2, 2, -2, -2);
        this.fireEvent("activate", this);
        return true;
    },

    // private
    deactivate : function(){
        this.container.removeClass(this.activeClass);
        this.fireEvent("deactivate", this);
    },

    // private
    shouldDeactivate : function(e){
        return !this.region || !this.region.contains(e.getPoint());
    },

    // private
    handleClick : function(e){
        if(this.hideOnClick){
            this.parentMenu.hide.defer(this.hideDelay, this.parentMenu, [true]);
        }
    },

    // private
    expandMenu : function(autoActivate){
        // do nothing
    },

    // private
    hideMenu : function(){
        // do nothing
    }
});