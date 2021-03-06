/*
 * @version Sencha 1.0RC-1
 * @ignore
 * @author Frank Cheung <frank@ajaxjs.com>
 * ---------------------请保留该段信息。-------------------------
 * 项目主页：http://code.google.com/p/chineseext/
 * 欢迎参与我们翻译的工作！详见《Sencha Touch中文化相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=2951
 *                                                JS堂翻译小组
 * ---------------------请保留该段信息。-------------------------
 */

/**
 * @class Ext.AbstractStoreSelectionModel
 * @extends Ext.util.Observable
 *
 * 跟踪有什么记录是选中的、选取的，在一些数据绑定的器件中。是一个抽象的方法不宜直接使用它。
 * 数据绑定的器件就是GridPanel、TreePanel和ListView，它们应该有继承AbstractStoreSelectionModel的子类参与组建的数据绑定。
 * 抽象方法 onSelectChange及onLastFocusChanged应该在子类中去实现，以提供更新UI组件的功能。
 * <br />
 * Tracks what records are currently selected in a databound widget.
 *
 * This is an abstract class and is not meant to be directly used.
 *
 * DataBound UI widgets such as GridPanel, TreePanel, and ListView
 * should subclass AbstractStoreSelectionModel and provide a way
 * to binding to the component.
 * The abstract methods onSelectChange and onLastFocusChanged should
 * be implemented in these subclasses to update the UI widget.
 */
Ext.AbstractStoreSelectionModel = Ext.extend(Ext.util.Observable, {
    // lastSelected

    /**
     * @cfg {String} mode
     * 选择的模式。可以SINGLE、SIMPLE和MULTI三种值的一种。默认是“SINGLE”。
     * Modes of selection.
     * Valid values are SINGLE, SIMPLE, and MULTI. Defaults to 'SINGLE'
     */

    /**
     * @property selected
     * 只读的。保存当前已选择记录的MixedCollection对象。
     * READ-ONLY A MixedCollection that maintains all of the currently selected
     * records.
     */
    selected: null,

    constructor: function(cfg) {
        cfg = cfg || {};
        Ext.apply(this, cfg);

        this.modes = {
            SINGLE: true,
            SIMPLE: true,
            MULTI: true
        };

        // 设置selectionMode sets this.selectionMode
        this.setSelectionMode(cfg.mode);

        // 保存当前选好的记录。 maintains the currently selected records.
        this.selected = new Ext.util.MixedCollection();

        Ext.AbstractStoreSelectionModel.superclass.constructor.call(this, cfg);
    },

    // 绑定Store到selModel。binds the store to the selModel.
    bind : function(store, initial){
        if(!initial && this.store){
            if(store !== this.store && this.store.autoDestroy){
                this.store.destroy();
            }else{
                this.store.un("add", this.onStoreAdd, this);
                this.store.un("clear", this.onStoreClear, this);
                this.store.un("remove", this.onStoreRemove, this);
                this.store.un("update", this.onStoreUpdate, this);
            }
        }
        if(store){
            store = Ext.StoreMgr.lookup(store);
            store.on({
                add: this.onStoreAdd,
                clear: this.onStoreClear,
                remove: this.onStoreRemove,
                update: this.onStoreUpdate,
                scope: this
            });
        }
        this.store = store;
        if(store && !initial){
            this.refresh();
        }
    },

    selectAll: function(silent) {
        var selections = this.store.getRange();
        for (var i = 0, ln = selections.length; i < ln; i++) {
            this.doSelect(selections[i], true, silent);
        }
    },

    deselectAll: function() {
        var selections = this.getSelection();
        for (var i = 0, ln = selections.length; i < ln; i++) {
            this.doDeselect(selections[i]);
        }
    },

    // 决定MULTI, SIMPLE and SINGLE选区模式其不同的逻辑。
    // 必须传入事件好让我们知道用户是否按下了ctrl或者shift键。
    // Provides differentiation of logic between MULTI, SIMPLE and SINGLE
    // selection modes. Requires that an event be passed so that we can know
    // if user held ctrl or shift.
    selectWithEvent: function(record, e) {
        switch (this.selectionMode) {
            case 'MULTI':
                if (e.ctrlKey && this.isSelected(record)) {
                    this.doDeselect(record, false);
                } else if (e.shiftKey && this.lastFocused) {
                    this.selectRange(this.lastFocused, record, e.ctrlKey);
                } else if (e.ctrlKey) {
                    this.doSelect(record, true, false);
                } else if (this.isSelected(record) && !e.shiftKey && !e.ctrlKey && this.selected.getCount() > 1) {
                    this.doSelect(record, false, false);
                } else {
                    this.doSelect(record, false);
                }
                break;
            case 'SIMPLE':
                if (this.isSelected(record)) {
                    this.doDeselect(record);
                } else {
                    this.doSelect(record, true);
                }
                break;
            case 'SINGLE':
                this.doSelect(record, false);
                break;
        }
    },

    /**
     * 如选区模型{@link Ext.grid.AbstractSelectionModel#isLocked 不是锁定的}，选取多个行。行上限：startRow，行下限：endRow。
     * Selects a range of rows if the selection model
     * {@link Ext.grid.AbstractSelectionModel#isLocked is not locked}.
     * All rows in between startRow and endRow are also selected.
     * @param {Number} startRow 行上限。The index of the first row in the range
     * @param {Number} endRow 行下限。The index of the last row in the range
     * @param {Boolean} keepExisting (可选项)true代表保留当前选区。(optional) True to retain existing selections
     */
    selectRange : function(startRecord, endRecord, keepExisting, dir){
        var i,
            startRow = this.store.indexOf(startRecord),
            endRow = this.store.indexOf(endRecord),
            tmp,
            selectedCount = 0,
            dontDeselect;

        if (this.isLocked()){
            return;
        }

        // 交换值。 swap values
        if (startRow > endRow){
            tmp = endRow;
            endRow = startRow;
            startRow = tmp;
        }

        for (i = startRow; i <= endRow; i++) {
            if (this.isSelected(this.store.getAt(i))) {
                selectedCount++;
            }
        }

        if (!dir) {
            dontDeselect = -1;
        } else {
            dontDeselect = (dir == 'up') ? startRow : endRow;
        }
        for (i = startRow; i <= endRow; i++){
            if (selectedCount == (endRow - startRow + 1)) {
                if (i != dontDeselect) {
                    this.doDeselect(i, true);
                }
            } else {
                this.doSelect(i, true);
            }

        }
    },
    
    /**
     * 选取record。传入索引亦可。
     * Selects a record instance by record instance or index.
     * @param {Ext.data.Record/Index} records 记录数组或索引。An array of records or an index
     * @param {Boolean} keepExisting (可选项)true表示为保留当前选区。
     * @param {Boolean} suppressEvent  (可选项)true表示为跳过所有selectionchange事件。Set to false to not fire a select event
     */
    select: function(records, keepExisting, suppressEvent) {
        this.doSelect(records, keepExisting, suppressEvent);
    },

    /**
     * 反选record。传入索引亦可。
     * Deselects a record instance by record instance or index.
     * @param {Ext.data.Record/Index} records 记录数组或索引。An array of records or an index
     * @param {Boolean} suppressEvent (可选项)true表示为跳过所有deselect事件。Set to false to not fire a deselect event
     */
    deselect: function(records, suppressEvent) {
        this.doDeselect(records, suppressEvent);
    },
    
    doSelect: function(records, keepExisting, suppressEvent) {
        if (this.locked) {
            return;
        }
        if (typeof records === "number") {
            records = [this.store.getAt(records)];
        }
        if (this.selectionMode == "SINGLE" && records) {
            var record = records.length ? records[0] : records;
            this.doSingleSelect(record, suppressEvent);
        } else {
            this.doMultiSelect(records, keepExisting, suppressEvent);
        }
    },

    doMultiSelect: function(records, keepExisting, suppressEvent) {
        if (this.locked) {
            return;
        }
        var selected = this.selected,
            change = false,
            record;

        records = !Ext.isArray(records) ? [records] : records;
        if (!keepExisting && selected.getCount() > 0) {
            change = true;
            this.doDeselect(this.getSelection(), true);
        }

        for (var i = 0, ln = records.length; i < ln; i++) {
            record = records[i];
            if (keepExisting && this.isSelected(record)) {
                continue;
            }
            change = true;
            this.lastSelected = record;
            selected.add(record);
            if (!suppressEvent) {
                this.setLastFocused(record);
            }

            this.onSelectChange(record, true, suppressEvent);
        }
        // 如果有改变的话并且没有跳过事件的指令，就触发selchange事件。fire selchange if there was a change and there is no suppressEvent flag
        this.maybeFireSelectionChange(change && !suppressEvent);
    },

    // 可以通过索引、记录本身、或记录数组来表示记录。 records can be an index, a record or an array of records
    doDeselect: function(records, suppressEvent) {
        if (this.locked) {
            return;
        }

        if (typeof records === "number") {
            records = [this.store.getAt(records)];
        }

        var change = false,
            selected = this.selected,
            record;

        records = !Ext.isArray(records) ? [records] : records;
        for (var i = 0, ln = records.length; i < ln; i++) {
            record = records[i];
            if (selected.remove(record)) {
                if (this.lastSelected == record) {
                    this.lastSelected = selected.last();
                }
                this.onSelectChange(record, false, suppressEvent);
                change = true;
            }
        }
        // 如果有改变的话并且没有跳过事件的指令，就触发selchange事件。fire selchange if there was a change and there is no suppressEvent flag
        this.maybeFireSelectionChange(change && !suppressEvent);
    },

    doSingleSelect: function(record, suppressEvent) {
        if (this.locked) {
            return;
        }
        // 已选择，是否还检查一下beforeselect？
        // already selected.
        // should we also check beforeselect?
        if (this.isSelected(record)) {
            return;
        }
        var selected = this.selected;
        if (selected.getCount() > 0) {
            this.doDeselect(this.lastSelected, suppressEvent);
        }
        selected.add(record);
        this.lastSelected = record;
        this.onSelectChange(record, true, suppressEvent);
        this.setLastFocused(record);
        this.maybeFireSelectionChange(!suppressEvent);
    },

    /**
     * @param {Ext.data.Record} record
     * 设置送入的record作为最后得到焦点的记录。如果记录已经选择这个方法就没有意义。
     * Set a record as the last focused record. This does NOT mean
     * that the record has been selected.
     */
    setLastFocused: function(record) {
        var recordBeforeLast = this.lastFocused;
        this.lastFocused = record;
        this.onLastFocusChanged(recordBeforeLast, record);
    },


    // fire selection change as long as true is not passed
    // into maybeFireSelectionChange
    maybeFireSelectionChange: function(fireEvent) {
        if (fireEvent) {
            this.fireEvent('selectionchange', this, this.getSelection());
        }
    },

    /**
     * 返回最后选择的记录。
     * Returns the last selected record.
     */
    getLastSelected: function() {
        return this.lastSelected;
    },
    
    getLastFocused: function() {
        return this.lastFocused;
    },

    /**
     * 返回当前已选择的记录。
     * Returns an array of the currently selected records.
     */
    getSelection: function() {
        return this.selected.getRange();
    },

    /**
     * 返回当前的选择模式。可以是SINGLE、SIMPLE和MULTI三种值的一种。
     * Returns the current selectionMode. SINGLE, MULTI or SIMPLE.
     */
    getSelectionMode: function() {
        return this.selectionMode;
    },

    /**
     * 设置当前的选择模式。参数可以是SINGLE、SIMPLE和MULTI三种值的一种。
     * Sets the current selectionMode. SINGLE, MULTI or SIMPLE.
     */
    setSelectionMode: function(selMode) {
        selMode = selMode ? selMode.toUpperCase() : 'SINGLE';
        // 默认SINGLE。 set to mode specified unless it doesnt exist, in that case
        // use single.
        this.selectionMode = this.modes[selMode] ? selMode : 'SINGLE';
    },

    /**
     * 返回true表示当前选区是锁定的。
     * Returns true if the selections are locked.
     * @return {Boolean}
     */
    isLocked: function() {
        return this.locked;
    },

    /**
     * 锁定当前选区，不让人动它。
     * Locks the current selection and disables any changes from
     * happening to the selection.
     * @param {Boolean} locked
     */
    setLocked: function(locked) {
        this.locked = !!locked;
    },

    /**
     * 检查特定行是否选择。
     * Returns <tt>true</tt> if the specified row is selected.
     * @param {Record/Number} record Record对象或者是Record的索引。The record or index of the record to check
     * @return {Boolean}
     */
    isSelected: function(record) {
        record = Ext.isNumber(record) ? this.store.getAt(record) : record;
        return this.selected.indexOf(record) !== -1;
    },
    
    /**
     * 返回true的话表示有选择选区。
     * Returns true if there is a selected record.
     * @return {Boolean}
     */
    hasSelection: function() {
        return this.selected.getCount() > 0;
    },

    refresh: function() {
        var toBeSelected = [],
            oldSelections = this.getSelection(),
            ln = oldSelections.length,
            selection,
            change,
            i = 0;

        // 在执行刷新之后，必须保证没有记录漏掉，否则的话要重新读取要选择的。
        // check to make sure that there are no records
        // missing after the refresh was triggered, prune
        // them from what is to be selected if so
        for (; i < ln; i++) {
            selection = oldSelections[i];
            if (this.store.indexOf(selection) != -1) {
                toBeSelected.push(selection);
            }
        }

        // 旧选择和新选区不相同，就是有变动。there was a change from the old selected and
        // the new selection
        if (this.selected.getCount() != toBeSelected.length) {
            change = true;
        }

        this.clearSelections();

        if (toBeSelected.length) {
            // 再次选取选区。 perform the selection again
            this.doSelect(toBeSelected, false, true);
        }
        
        this.maybeFireSelectionChange(change);
    },

    clearSelections: function() {
        // 复位整个选区。 reset the entire selection to nothing
        this.selected.clear();
        this.lastSelected = null;
        this.setLastFocused(null);
    },

    //当有Store有记录加入。when a record is added to a store
    onStoreAdd: function() {

    },

    // 当store没有数据时，选区也就没有了（如果有的话）。when a store is cleared remove all selections
    // (if there were any)
    onStoreClear: function() {
        var selected = this.selected;
        if (selected.getCount > 0) {
            selected.clear();
            this.lastSelected = null;
            this.setLastFocused(null);
            this.maybeFireSelectionChange(true);
        }
    },

    // 如果选中的记录其中有被移除的，就SelectionModel中剔除。prune records from the SelectionModel if
    // they were selected at the time they were
    // removed.
    onStoreRemove: function(store, record) {
        if (this.locked) {
            return;
        }
        var selected = this.selected;
        if (selected.remove(record)) {
            if (this.lastSelected == record) {
                this.lastSelected = null;
            }
            if (this.getLastFocused() == record) {
                this.setLastFocused(null);
            }
            this.maybeFireSelectionChange(true);
        }
    },

    getCount: function() {
        return this.selected.getCount();
    },

    // cleanup.
    destroy: function() {

    },

    // if records are updated
    onStoreUpdate: function() {

    },

    // @abstract
    onSelectChange: function(record, isSelected, suppressEvent) {

    },

    // @abstract
    onLastFocusChanged: function(oldFocused, newFocused) {

    },

    // @abstract
    onEditorKey: function(field, e) {

    },

    // @abstract
    bindComponent: function(cmp) {

    }
});