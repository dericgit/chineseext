/*
 * 更新地址：http://ajaxjs.com/docs
 * 欢迎参与我们翻译的工作！详见《EXT API2Chinese 相关事宜》：
 * http://bbs.ajaxjs.com/viewthread.php?tid=90 Ext中文站翻译小组
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
 * @class Ext.History
 * @extends Ext.util.Observable
 * History management component that allows you to register arbitrary tokens that signify application
 * history state on navigation actions.  You can then handle the history {@link #change} event in order
 * to reset your application UI to the appropriate state when the user navigates forward or backward through
 * the browser history stack.
 * @singleton
 */
Ext.History = (function () {
    var iframe, hiddenField;
    var ready = false;
    var currentToken;

    function getHash() {
        var href = top.location.href, i = href.indexOf("#");
        return i >= 0 ? href.substr(i + 1) : null;
    }

    function doSave() {
        hiddenField.value = currentToken;
    }

    function handleStateChange(token) {
        currentToken = token;
        Ext.History.fireEvent('change', token);
    }

    function updateIFrame (token) {
        var html = ['<html><body><div id="state">',token,'</div></body></html>'].join('');
        try {
            var doc = iframe.contentWindow.document;
            doc.open();
            doc.write(html);
            doc.close();
            return true;
        } catch (e) {
            return false;
        }
    }

    function checkIFrame() {
        if (!iframe.contentWindow || !iframe.contentWindow.document) {
            setTimeout(checkIFrame, 10);
            return;
        }

        var doc = iframe.contentWindow.document;
        var elem = doc.getElementById("state");
        var token = elem ? elem.innerText : null;

        var hash = getHash();

        setInterval(function () {

            doc = iframe.contentWindow.document;
            elem = doc.getElementById("state");

            var newtoken = elem ? elem.innerText : null;

            var newHash = getHash();

            if (newtoken !== token) {
                token = newtoken;
                handleStateChange(token);
                top.location.hash = token;
                hash = token;
                doSave();
            } else if (newHash !== hash) {
                hash = newHash;
                updateIFrame(newHash);
            }

        }, 50);

        ready = true;

        Ext.History.fireEvent('ready', Ext.History);
    }

    function startUp() {
        currentToken = hiddenField.value ? hiddenField.value : getHash();

        if (Ext.isIE) {
            checkIFrame();
        } else {
            var hash = getHash();
            setInterval(function () {
                var newHash = getHash();
                if (newHash !== hash) {
                    hash = newHash;
                    handleStateChange(hash);
                    doSave();
                }
            }, 50);
            ready = true;
            Ext.History.fireEvent('ready', Ext.History);
        }
    }

    return {
        /**
         * The id of the hidden field required for storing the current history token.
         * @type String
         * @property fieldId
         */
        fieldId: 'x-history-field',
        /**
         * The id of the iframe required by IE to manage the history stack.
         * @type String
         * @property iframeId
         */
        iframeId: 'x-history-frame',
        
        events:{},

        /**
         * Initialize the global History instance.
         * @param {Boolean} onReady (optional) A callback function that will be called once the history
         * component is fully initialized.
         * @param {Object} scope (optional) The callback scope
         */
        init: function (onReady, scope) {
            if(ready) {
                Ext.callback(onReady, scope, [this]);
                return;
            }
            if(!Ext.isReady){
                Ext.onReady(function(){
                    Ext.History.init(onReady, scope);
                });
                return;
            }
            hiddenField = Ext.getDom(Ext.History.fieldId);
            if (Ext.isIE) {
                iframe = Ext.getDom(Ext.History.iframeId);
            }
            this.addEvents('ready', 'change');
            if(onReady){
                this.on('ready', onReady, scope, {single:true});
            }
            startUp();
        },

        /**
         * Add a new token to the history stack. This can be any arbitrary value, although it would
         * commonly be the concatenation of a component id and another id marking the specifc history
         * state of that component.  Example usage:
         * <pre><code>
// Handle tab changes on a TabPanel
tabPanel.on('tabchange', function(tabPanel, tab){
    Ext.History.add(tabPanel.id + ':' + tab.id);
});
</code></pre>
         * @param {String} token The value that defines a particular application-specific history state
         * @param {Boolean} preventDuplicates When true, if the passed token matches the current token
         * it will not save a new history step. Set to false if the same state can be saved more than once
         * at the same history stack location (defaults to true).
         */
        add: function (token, preventDup) {
            if(preventDup !== false){
                if(this.getToken() == token){
                    return true;
                }
            }
            if (Ext.isIE) {
                return updateIFrame(token);
            } else {
                top.location.hash = token;
                return true;
            }
        },

        /**
         * Programmatically steps back one step in browser history (equivalent to the user pressing the Back button).
         */
        back: function(){
            history.go(-1);
        },

        /**
         * Programmatically steps forward one step in browser history (equivalent to the user pressing the Forward button).
         */
        forward: function(){
            history.go(1);
        },

        /**
         * Retrieves the currently-active history token.
         * @return {String} The token
         */
        getToken: function() {
            return ready ? currentToken : getHash();
        }
    };
})();
Ext.apply(Ext.History, new Ext.util.Observable());