/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @todo
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */

/**
 * @author Aaron Conran
 * @class Ext.data.TreeStore
 * @extends Ext.data.AbstractStore
 * <p>表示层次数据的Store。A store class that allows the representation of hierarchical data.</p>
 * @constructor
 * @param {Object} config 可选的配置项对象。Optional config object
 */
Ext.data.TreeStore = Ext.extend(Ext.data.AbstractStore, {
    /**
     * @cfg {Boolean} clearOnLoad (optional) Default to true. Remove previously existing
     * child nodes before loading.
     */
    clearOnLoad : true,

    /**
     * @cfg {String} nodeParam The name of the parameter sent to the server which contains
     * the identifier of the node. Defaults to <tt>'node'</tt>.
     */
    nodeParam: 'node',

    /**
     * @cfg {String} defaultRootId
     * The default root id. Defaults to 'root'
     */
    defaultRootId: 'root',

    constructor: function(config) {
        config = config || {};
        var rootCfg = config.root || {};
        rootCfg.id = rootCfg.id || this.defaultRootId;

        // create a default rootNode and create internal data struct.
        var rootNode = new Ext.data.RecordNode(rootCfg);
        this.tree = new Ext.data.Tree(rootNode);
        this.tree.treeStore = this;

        Ext.data.TreeStore.superclass.constructor.call(this, config);
        
        //<deprecated since=0.99>
        if (Ext.isDefined(this.nodeParameter)) {
            throw "Ext.data.TreeStore: nodeParameter has been renamed to nodeParam for consistency";
        }
        //</deprecated>

        if (config.root) {
            this.read({
                node: rootNode,
                doPreload: true
            });
        }
    },


    /**
     * Returns the root node for this tree.
     * @return {Ext.data.RecordNode}
     */
    getRootNode: function() {
        return this.tree.getRootNode();
    },

    /**
     * Returns the record node by id
     * @return {Ext.data.RecordNode}
     */
    getNodeById: function(id) {
        return this.tree.getNodeById(id);
    },


    // new options are
    // * node - a node within the tree
    // * doPreload - private option used to preload existing childNodes
    load: function(options) {
        options = options || {};
        options.params = options.params || {};

        var node = options.node || this.tree.getRootNode(),
            records,
            record,
            reader = this.proxy.reader,
            root;

        if (this.clearOnLoad) {
            while (node.firstChild){
                node.removeChild(node.firstChild);
            }
        }

        if (!options.doPreload) {
            Ext.applyIf(options, {
                node: node
            });
            record = node.getRecord();
            options.params[this.nodeParam] = record ? record.getId() : 'root';

            return Ext.data.TreeStore.superclass.load.call(this, options);
        } else {
            root = reader.getRoot(node.isRoot ? node.attributes : node.getRecord().raw);
            records = reader.extractData(root, true);
            this.fillNode(node, records);
            return true;
        }
    },

    // @private
    // fills an Ext.data.RecordNode with records
    fillNode: function(node, records) {
        node.loaded = true;
        var ln = records.length,
            recordNode,
            i = 0,
            raw,
            subStore = node.subStore;

        for (; i < ln; i++) {
            raw = records[i].raw;
            records[i].data.leaf = raw.leaf;
            recordNode = new Ext.data.RecordNode({
                id: records[i].getId(),
                leaf: raw.leaf,
                record: records[i],
                expanded: raw.expanded
            });
            node.appendChild(recordNode);
            if (records[i].doPreload) {
                this.load({
                    node: recordNode,
                    doPreload: true
                });
            }
        }

        // maintain the subStore if its already been created
        if (subStore) {
            if (this.clearOnLoad) {
                subStore.removeAll();
            }
            subStore.add.apply(subStore, records);
        }
    },


    onProxyLoad: function(operation) {
        var records = operation.getRecords();

        this.fillNode(operation.node, records);

        this.fireEvent('read', this, operation.node, records, operation.wasSuccessful());
        //this is a callback that would have been passed to the 'read' function and is optional
        var callback = operation.callback;
        if (typeof callback == 'function') {
            callback.call(operation.scope || this, records, operation, operation.wasSuccessful());
        }
    },


    /**
     * Returns a flat Ext.data.Store with the correct type of model.
     * @param {Ext.data.RecordNode/Ext.data.Record} record
     * @returns Ext.data.Store
     */
    getSubStore: function(node) {
        // Remap Record to RecordNode
        if (node && node.node) {
            node = node.node;
        }
        return node.getSubStore();
    },


    removeAll: function() {
        var rootNode = this.getRootNode();
        rootNode.destroy();
    }
});
