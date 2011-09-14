/*
 * 项目地址：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com Ext中文站翻译小组
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
 /**
 * @class Ext.tree.TreeDropZone
 * @extends Ext.dd.DropZone
 * @constructor
 * @param {String/HTMLElement/Element} tree 要允许落下的{@link Ext.tree.TreePanel}
 * @param {Object} config
 */
if(Ext.dd.DropZone){
    
Ext.tree.TreeDropZone = function(tree, config){
    /**
     * @cfg {Boolean} allowParentInsert
     * Allow inserting a dragged node between an expanded parent node and its first child that will become a
     * sibling of the parent when dropped (defaults to false)
     */
    this.allowParentInsert = false;
    /**
     * @cfg {String} allowContainerDrop
     * True if drops on the tree container (outside of a specific tree node) are allowed (defaults to false)
     */
    this.allowContainerDrop = false;
    /**
     * @cfg {String} appendOnly
     * True if the tree should only allow append drops (use for trees which are sorted, defaults to false)
     */
    this.appendOnly = false;
    Ext.tree.TreeDropZone.superclass.constructor.call(this, tree.innerCt, config);
    /**
    * The TreePanel for this drop zone
    * @type Ext.tree.TreePanel
    * @property tree
    */
    this.tree = tree;
    /**
    * Arbitrary data that can be associated with this tree and will be included in the event object that gets
    * passed to any nodedragover event handler (defaults to {})
    * @type Ext.tree.TreePanel
    * @property dragOverData
    */
    this.dragOverData = {};
    // private
    this.lastInsertClass = "x-tree-no-status";
};

Ext.extend(Ext.tree.TreeDropZone, Ext.dd.DropZone, {
    /**
     * @cfg {String} ddGroup
     * 该对象隶属于组的名称。如果已指定组，那该对象只会与同组下其他拖放成员相交互（默认为“TreeDD”）。
     */
    ddGroup : "TreeDD",

    /**
     * @cfg {String} expandDelay
     * 在拖动到一个可落下的节点时，到目标上方，距离展开树节点 等待的毫秒数。（默认为1000）
     */
    expandDelay : 1000,

    // private
    expandNode : function(node){
        if(node.hasChildNodes() && !node.isExpanded()){
            node.expand(false, null, this.triggerCacheRefresh.createDelegate(this));
        }
    },

    // private
    queueExpand : function(node){
        this.expandProcId = this.expandNode.defer(this.expandDelay, this, [node]);
    },

    // private
    cancelExpand : function(){
        if(this.expandProcId){
            clearTimeout(this.expandProcId);
            this.expandProcId = false;
        }
    },

    // private
    isValidDropPoint : function(n, pt, dd, e, data){
        if(!n || !data){ return false; }
        var targetNode = n.node;
        var dropNode = data.node;
        // default drop rules
        if(!(targetNode && targetNode.isTarget && pt)){
            return false;
        }
        if(pt == "append" && targetNode.allowChildren === false){
            return false;
        }
        if((pt == "above" || pt == "below") && (targetNode.parentNode && targetNode.parentNode.allowChildren === false)){
            return false;
        }
        if(dropNode && (targetNode == dropNode || dropNode.contains(targetNode))){
            return false;
        }
        // reuse the object
        var overEvent = this.dragOverData;
        overEvent.tree = this.tree;
        overEvent.target = targetNode;
        overEvent.data = data;
        overEvent.point = pt;
        overEvent.source = dd;
        overEvent.rawEvent = e;
        overEvent.dropNode = dropNode;
        overEvent.cancel = false;  
        var result = this.tree.fireEvent("nodedragover", overEvent);
        return overEvent.cancel === false && result !== false;
    },

    // private
    getDropPoint : function(e, n, dd){
        var tn = n.node;
        if(tn.isRoot){
            return tn.allowChildren !== false ? "append" : false; // always append for root
        }
        var dragEl = n.ddel;
        var t = Ext.lib.Dom.getY(dragEl), b = t + dragEl.offsetHeight;
        var y = Ext.lib.Event.getPageY(e);
        var noAppend = tn.allowChildren === false || tn.isLeaf();
        if(this.appendOnly || tn.parentNode.allowChildren === false){
            return noAppend ? false : "append";
        }
        var noBelow = false;
        if(!this.allowParentInsert){
            noBelow = tn.hasChildNodes() && tn.isExpanded();
        }
        var q = (b - t) / (noAppend ? 2 : 3);
        if(y >= t && y < (t + q)){
            return "above";
        }else if(!noBelow && (noAppend || y >= b-q && y <= b)){
            return "below";
        }else{
            return "append";
        }
    },

    // private
    onNodeEnter : function(n, dd, e, data){
        this.cancelExpand();
    },

    // private
    onNodeOver : function(n, dd, e, data){
        var pt = this.getDropPoint(e, n, dd);
        var node = n.node;
        
        // auto node expand check
        if(!this.expandProcId && pt == "append" && node.hasChildNodes() && !n.node.isExpanded()){
            this.queueExpand(node);
        }else if(pt != "append"){
            this.cancelExpand();
        }
        
        // set the insert point style on the target node
        var returnCls = this.dropNotAllowed;
        if(this.isValidDropPoint(n, pt, dd, e, data)){
           if(pt){
               var el = n.ddel;
               var cls;
               if(pt == "above"){
                   returnCls = n.node.isFirst() ? "x-tree-drop-ok-above" : "x-tree-drop-ok-between";
                   cls = "x-tree-drag-insert-above";
               }else if(pt == "below"){
                   returnCls = n.node.isLast() ? "x-tree-drop-ok-below" : "x-tree-drop-ok-between";
                   cls = "x-tree-drag-insert-below";
               }else{
                   returnCls = "x-tree-drop-ok-append";
                   cls = "x-tree-drag-append";
               }
               if(this.lastInsertClass != cls){
                   Ext.fly(el).replaceClass(this.lastInsertClass, cls);
                   this.lastInsertClass = cls;
               }
           }
       }
       return returnCls;
    },

    // private
    onNodeOut : function(n, dd, e, data){
        this.cancelExpand();
        this.removeDropIndicators(n);
    },

    // private
    onNodeDrop : function(n, dd, e, data){
        var point = this.getDropPoint(e, n, dd);
        var targetNode = n.node;
        targetNode.ui.startDrop();
        if(!this.isValidDropPoint(n, point, dd, e, data)){
            targetNode.ui.endDrop();
            return false;
        }
        // first try to find the drop node
        var dropNode = data.node || (dd.getTreeNode ? dd.getTreeNode(data, targetNode, point, e) : null);
        var dropEvent = {
            tree : this.tree,
            target: targetNode,
            data: data,
            point: point,
            source: dd,
            rawEvent: e,
            dropNode: dropNode,
            cancel: !dropNode   
        };
        var retval = this.tree.fireEvent("beforenodedrop", dropEvent);
        if(retval === false || dropEvent.cancel === true || !dropEvent.dropNode){
            targetNode.ui.endDrop();
            return false;
        }
        // allow target changing
        targetNode = dropEvent.target;
        if(point == "append" && !targetNode.isExpanded()){
            targetNode.expand(false, null, function(){
                this.completeDrop(dropEvent);
            }.createDelegate(this));
        }else{
            this.completeDrop(dropEvent);
        }
        return true;
    },

    // private
    completeDrop : function(de){
        var ns = de.dropNode, p = de.point, t = de.target;
        if(!(ns instanceof Array)){
            ns = [ns];
        }
        var n;
        for(var i = 0, len = ns.length; i < len; i++){
            n = ns[i];
            if(p == "above"){
                t.parentNode.insertBefore(n, t);
            }else if(p == "below"){
                t.parentNode.insertBefore(n, t.nextSibling);
            }else{
                t.appendChild(n);
            }
        }
        n.ui.focus();
        if(this.tree.hlDrop){
            n.ui.highlight();
        }
        t.ui.endDrop();
        this.tree.fireEvent("nodedrop", de);
    },

    // private
    afterNodeMoved : function(dd, data, e, targetNode, dropNode){
        if(this.tree.hlDrop){
            dropNode.ui.focus();
            dropNode.ui.highlight();
        }
        this.tree.fireEvent("nodedrop", this.tree, targetNode, data, dd, e);
    },

    // private
    getTree : function(){
        return this.tree;
    },

    // private
    removeDropIndicators : function(n){
        if(n && n.ddel){
            var el = n.ddel;
            Ext.fly(el).removeClass([
                    "x-tree-drag-insert-above",
                    "x-tree-drag-insert-below",
                    "x-tree-drag-append"]);
            this.lastInsertClass = "_noclass";
        }
    },

    // private
    beforeDragDrop : function(target, e, id){
        this.cancelExpand();
        return true;
    },

    // private
    afterRepair : function(data){
        if(data && Ext.enableFx){
            data.node.ui.highlight();
        }
        this.hideProxy();
    }    
});

}