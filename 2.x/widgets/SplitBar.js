/**
 * @class Ext.SplitBar
 * @extends Ext.util.Observable
 * ��DOMԪ�ش�������ק�ķָ�ؼ�(������ק�͸ı�Ĵ�С��Ԫ��)��
 * <br><br>
 * Usage:
 * <pre><code>
var split = new Ext.SplitBar("elementToDrag", "elementToSize",
                   Ext.SplitBar.HORIZONTAL, Ext.SplitBar.LEFT);
split.setAdapter(new Ext.SplitBar.AbsoluteLayoutAdapter("container"));
split.minSize = 100;
split.maxSize = 600;
split.animate = true;
split.on('moved', splitterMoved);
</code></pre>
 * @���캯��
 * ����һ���µķָ�ؼ�
 * @���� {Mixed} ��ק��Ԫ�� ��Ϊ�ָ�ؼ�����ק��Ԫ�ء�
 * @���� {Mixed} ��������С��Ԫ��  ���� �ָ�ؼ� ����ק���Ŵ�С��Ԫ��
 * @���� {Number} ���� (��ѡ)   Ext.SplitBar.HORIZONTAL ����Ext.SplitBar.VERTICAL. (Ĭ��Ϊ HORIZONTAL)
 * @���� {Number} ��λ (��ѡ)  ˮƽ�����ϣ�Ext.SplitBar.LEFT ���� Ext.SplitBar.RIGHT   
                        ��ֱ�����ϣ�Ext.SplitBar.TOP�� Ext.SplitBar.BOTTOM��(Ĭ�ϵĻ����SplitBar��ʼ����λ���Լ�����)��
 */
Ext.SplitBar = function(dragElement, resizingElement, orientation, placement, existingProxy){
    
    /**@˽�е� */
    this.el = Ext.get(dragElement, true);
    this.el.dom.unselectable = "on";
    /**@˽�е� */
    this.resizingEl = Ext.get(resizingElement, true);

    /**
     * @˽�е�
     * �ָ�ؼ��ķ���Ext.SplitBar.HORIZONTAL ���� Ext.SplitBar.VERTICAL. (Ĭ��Ϊ HORIZONTAL)
     * Note: ����ڷָ�ؼ����������޸ĸ����ԣ�placement���Ա���Ҫ�ֶ��޸�
     * @type Number
     */
    this.orientation = orientation || Ext.SplitBar.HORIZONTAL;
    
    /**
     * ������Ԫ�ص���Сֵ(Ĭ��Ϊ 0)
     * @type Number
     */
    this.minSize = 0;
    
    /**
     * ������Ԫ�ص����ֵ�� (Ĭ��Ϊ 2000)
     * @type Number
     */
    this.maxSize = 2000;
    
    /**
     * ��С�仯ʱ�Ƿ��������Ч��
     * @type Boolean
     */
    this.animate = false;
    
    /**
     * ��ק��ʱ���Ƿ���ҳ��������͸���㡣�����iframes��ק
     * @type Boolean
     */
    this.useShim = false;
    
    /**@˽�е� */
    this.shim = null;
    
    if(!existingProxy){
        /**@˽�е� */
        this.proxy = Ext.SplitBar.createProxy(this.orientation);
    }else{
        this.proxy = Ext.get(existingProxy).dom;
    }
    /**@˽�е� */
    this.dd = new Ext.dd.DDProxy(this.el.dom.id, "XSplitBars", {dragElId : this.proxy.id});
    
    /**@˽�е� */
    this.dd.b4StartDrag = this.onStartProxyDrag.createDelegate(this);
    
    /**@˽�е� */
    this.dd.endDrag = this.onEndProxyDrag.createDelegate(this);
    
    /**@˽�е� */
    this.dragSpecs = {};
    
    /**
     *@˽�е� ���ú�����Ԫ�ش�С��������
     */
    this.adapter = new Ext.SplitBar.BasicLayoutAdapter();
    this.adapter.init(this);
    
    if(this.orientation == Ext.SplitBar.HORIZONTAL){
        /**@˽�е� */
        this.placement = placement || (this.el.getX() > this.resizingEl.getX() ? Ext.SplitBar.LEFT : Ext.SplitBar.RIGHT);
        this.el.addClass("x-splitbar-h");
    }else{
        /**@˽�е� */
        this.placement = placement || (this.el.getY() > this.resizingEl.getY() ? Ext.SplitBar.TOP : Ext.SplitBar.BOTTOM);
        this.el.addClass("x-splitbar-v");
    }
    
    this.addEvents(
        /**
         * @event resize
         * ���ָ�ؼ��ƶ���ʱ�򼤷� ( {@link #event-moved}������)
         * @���� {Ext.SplitBar} this
         * @���� {Number} newSize �µĸ߶Ȼ��߿��
         */
        "resize",
        /**
         * @event moved
         * ���ָ�ؼ��ƶ���ʱ�򼤷�
         * @���� {Ext.SplitBar} this
         * @���� {Number} newSize �µĸ߶Ȼ��߿��
         */
        "moved",
        /**
         * @event beforeresize
         * ���ָ�ؼ�����ק��ʱ�򼤷�
         * @���� {Ext.SplitBar} this
         */
        "beforeresize",

        "beforeapply"
    );

    Ext.SplitBar.superclass.constructor.call(this);
};

Ext.extend(Ext.SplitBar, Ext.util.Observable, {
    onStartProxyDrag : function(x, y){
        this.fireEvent("beforeresize", this);
        this.overlay =  Ext.DomHelper.append(document.body,  {cls: "x-drag-overlay", html: "&#160;"}, true);
        this.overlay.unselectable();
        this.overlay.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
        this.overlay.show();
        Ext.get(this.proxy).setDisplayed("block");
        var size = this.adapter.getElementSize(this);
        this.activeMinSize = this.getMinimumSize();;
        this.activeMaxSize = this.getMaximumSize();;
        var c1 = size - this.activeMinSize;
        var c2 = Math.max(this.activeMaxSize - size, 0);
        if(this.orientation == Ext.SplitBar.HORIZONTAL){
            this.dd.resetConstraints();
            this.dd.setXConstraint(
                this.placement == Ext.SplitBar.LEFT ? c1 : c2, 
                this.placement == Ext.SplitBar.LEFT ? c2 : c1
            );
            this.dd.setYConstraint(0, 0);
        }else{
            this.dd.resetConstraints();
            this.dd.setXConstraint(0, 0);
            this.dd.setYConstraint(
                this.placement == Ext.SplitBar.TOP ? c1 : c2, 
                this.placement == Ext.SplitBar.TOP ? c2 : c1
            );
         }
        this.dragSpecs.startSize = size;
        this.dragSpecs.startPoint = [x, y];
        Ext.dd.DDProxy.prototype.b4StartDrag.call(this.dd, x, y);
    },
    
    /** 
     *@˽�е� ��ק����DDProxy����
     */
    onEndProxyDrag : function(e){
        Ext.get(this.proxy).setDisplayed(false);
        var endPoint = Ext.lib.Event.getXY(e);
        if(this.overlay){
            this.overlay.remove();
            delete this.overlay;
        }
        var newSize;
        if(this.orientation == Ext.SplitBar.HORIZONTAL){
            newSize = this.dragSpecs.startSize + 
                (this.placement == Ext.SplitBar.LEFT ?
                    endPoint[0] - this.dragSpecs.startPoint[0] :
                    this.dragSpecs.startPoint[0] - endPoint[0]
                );
        }else{
            newSize = this.dragSpecs.startSize + 
                (this.placement == Ext.SplitBar.TOP ?
                    endPoint[1] - this.dragSpecs.startPoint[1] :
                    this.dragSpecs.startPoint[1] - endPoint[1]
                );
        }
        newSize = Math.min(Math.max(newSize, this.activeMinSize), this.activeMaxSize);
        if(newSize != this.dragSpecs.startSize){
            if(this.fireEvent('beforeapply', this, newSize) !== false){
                this.adapter.setElementSize(this, newSize);
                this.fireEvent("moved", this, newSize);
                this.fireEvent("resize", this, newSize);
            }
        }
    },
    
    /**
     * ��ȡ�ָ�ؼ���������
     * @return The adapter object
     */
    getAdapter : function(){
        return this.adapter;
    },
    
    /**
     * ���÷ָ�ؼ���������
     * @���� {Object} adapter A SplitBar adapter object
     */
    setAdapter : function(adapter){
        this.adapter = adapter;
        this.adapter.init(this);
    },
    
    /**
     * ��ȡ��Ԫ�ؿ����ŵ���Сֵ
     * @return {Number} The minimum size
     */
    getMinimumSize : function(){
        return this.minSize;
    },
    
    /**
     * ���ø�Ԫ�ؿ����ŵ���Сֵ
     * @���� {Number} minSize ��С�ĳߴ�ֵ
     */
    setMinimumSize : function(minSize){
        this.minSize = minSize;
    },
    
    /**
     * ��ȡ��Ԫ�ؿ����ŵ����ֵ
     * @return {Number} The maximum size
     */
    getMaximumSize : function(){
        return this.maxSize;
    },
    
    /**
     * ���ø�Ԫ�ؿ����ŵ����ֵ
     * @���� {Number} maxSize ���ߴ�ֵ
     */
    setMaximumSize : function(maxSize){
        this.maxSize = maxSize;
    },
    
    /**
     * ���ø�Ԫ�س�ʼ��������ֵ
     * @���� {Number} size ��ʼ��ֵ
     */
    setCurrentSize : function(size){
        var oldAnimate = this.animate;
        this.animate = false;
        this.adapter.setElementSize(this, size);
        this.animate = oldAnimate;
    },
    
    /**
     *���ٷָ�ؼ�
     * @���� {Boolean} removeEl True��һ���ָ�ؼ�
     */
    destroy : function(removeEl){
        if(this.shim){
            this.shim.remove();
        }
        this.dd.unreg();
        Ext.removeNode(this.proxy);
        if(removeEl){
            this.el.remove();
        }
    }
});

/**
 *@˽�е� ��̬�� �����Լ��Ĵ���Ԫ�أ�ʹ���ڲ�ͬ��������У�����Ĵ�С��һ�¡�ʹ�ñ���ɫ����ʹ��borders��
 */
Ext.SplitBar.createProxy = function(dir){
    var proxy = new Ext.Element(document.createElement("div"));
    proxy.unselectable();
    var cls = 'x-splitbar-proxy';
    proxy.addClass(cls + ' ' + (dir == Ext.SplitBar.HORIZONTAL ? cls +'-h' : cls + '-v'));
    document.body.appendChild(proxy.dom);
    return proxy.dom;
};

/** 
 * @�� Ext.SplitBar.BasicLayoutAdapter
 * Ĭ�ϵ�������������ָ�����Ϳ��������û�б�Ԥ�ȶ�λ��
 * ����ֻ�ܻ�ȡ/����Ԫ�صĿ�ȡ�һ�����ڻ���table�����֡�
 */
Ext.SplitBar.BasicLayoutAdapter = function(){
};

Ext.SplitBar.BasicLayoutAdapter.prototype = {
    // ��ʱɶҲ����
    init : function(s){
    
    },
    /**
     * ����ק����ǰ���ã����ڻ�ȡ�����ŵ�Ԫ�صĵ�ǰ��С��
     * @���� {Ext.SplitBar} s The SplitBar using this adapter
     */
     getElementSize : function(s){
        if(s.orientation == Ext.SplitBar.HORIZONTAL){
            return s.resizingEl.getWidth();
        }else{
            return s.resizingEl.getHeight();
        }
    },
    
    /**
     *����ק��������ã��������ñ����ŵ�Ԫ�صĴ�С 
     * @���� {Ext.SplitBar} s The SplitBar using this adapter
     * @���� {Number} newSize The new size to set
     * @���� {Function} onComplete������ɺ���õĺ���
     */
    setElementSize : function(s, newSize, onComplete){
        if(s.orientation == Ext.SplitBar.HORIZONTAL){
            if(!s.animate){
                s.resizingEl.setWidth(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setWidth(newSize, true, .1, onComplete, 'easeOut');
            }
        }else{
            
            if(!s.animate){
                s.resizingEl.setHeight(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setHeight(newSize, true, .1, onComplete, 'easeOut');
            }
        }
    }
};

/** 
 *@�� Ext.SplitBar.AbsoluteLayoutAdapter
 * @���� Ext.SplitBar.BasicLayoutAdapter
 * �Ƿָ�ؼ�������Ԫ�ض������������ 
 * ʹ�þ��Զ�λ�ķָ�ؼ���ʱ��ʹ�á�
 * @���� {Mixed} container ��Χ���Զ�λ�ķָ�ؼ��������� �����������document.body��
 * һ��Ҫ���ÿؼ�ָ��һ��ID
 */
Ext.SplitBar.AbsoluteLayoutAdapter = function(container){
    this.basic = new Ext.SplitBar.BasicLayoutAdapter();
    this.container = Ext.get(container);
};

Ext.SplitBar.AbsoluteLayoutAdapter.prototype = {
    init : function(s){
        this.basic.init(s);
    },
    
    getElementSize : function(s){
        return this.basic.getElementSize(s);
    },
    
    setElementSize : function(s, newSize, onComplete){
        this.basic.setElementSize(s, newSize, this.moveSplitter.createDelegate(this, [s]));
    },
    
    moveSplitter : function(s){
        var yes = Ext.SplitBar;
        switch(s.placement){
            case yes.LEFT:
                s.el.setX(s.resizingEl.getRight());
                break;
            case yes.RIGHT:
                s.el.setStyle("right", (this.container.getWidth() - s.resizingEl.getLeft()) + "px");
                break;
            case yes.TOP:
                s.el.setY(s.resizingEl.getBottom());
                break;
            case yes.BOTTOM:
                s.el.setY(s.resizingEl.getTop() - s.el.getHeight());
                break;
        }
    }
};

/**
 * ������-����һ����ֱ�ָ�ؼ�
 * @static
 * @type Number
 */
Ext.SplitBar.VERTICAL = 1;

/**
 * ������-����һ��ˮƽ�ָ�ؼ�s
 * @static
 * @type Number
 */
Ext.SplitBar.HORIZONTAL = 2;

/**
 *��λ���� - ����Ԫ���ڷָ�ؼ�����ߡ�
 * @static
 * @type Number
 */
Ext.SplitBar.LEFT = 1;

/**
 * ��λ���� - ����Ԫ���ڷָ�ؼ����ұߡ�
 * @static
 * @type Number
 */
Ext.SplitBar.RIGHT = 2;

/**
 *��λ���� - ����Ԫ���ڷָ�ؼ������档
 * @static
 * @type Number
 */
Ext.SplitBar.TOP = 3;

/**
 * ��λ���� - ����Ԫ���ڷָ�ؼ������档
 * @static
 * @type Number
 */
Ext.SplitBar.BOTTOM = 4;
