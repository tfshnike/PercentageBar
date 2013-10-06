/**
 * @class Ext.ux.PercentageBar
 * @extends Ext.ProgressBar
 * new Ext.ux.PercentageBar({renderTo: 'el', value: 0.77, width: 300, text: '77%', animate: true})
 * @cfg {Float} value A floating point value between 0 and 1 (e.g., .5, defaults to 0)
 * @cfg {String} text The progress bar text (defaults to '')
 * @cfg {Mixed} textEl The element to render the progress text to (defaults to the progress
 * bar's internal text element)
 * @cfg {String} id The progress bar element's id (defaults to an auto-generated id)
 * @xtype ux_percentagebar
 */
Ext.ux.PercentageBar = Ext.extend(Ext.ProgressBar, {
   /**
    * @cfg {String} baseCls
    * The base CSS class to apply to the progress bar's wrapper element (defaults to 'x-progress')
    */
    baseCls: 'ux-procentageBar',
    
    /**
    * @cfg {Boolean} animate
    * True to animate the progress bar during transitions (defaults to false)
    */
    animate: false,

    // private
    waitTimer: null,

    // private
    initComponent : function(){
        Ext.ux.PercentageBar.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event update
             * Fires after each update interval
             * @param {Ext.ux.PercentageBar} this
             * @param {Number} value  The current percent value
             * @param {String} text The current percent text
             */
            "update"
        );
    },

    // private
    onRender : function(ct, position){
        var tpl = new Ext.Template(
            '<div class="{cls}-wrap">',
                '<div class="{cls}-bar">',
                '</div>',
                '<div class="{cls}-text">',
                    '<div>&#160;</div>',
                '</div>',
            '</div>'
        );

        this.el = position ? tpl.insertBefore(position, {cls: this.baseCls}, true)
            : tpl.append(ct, {cls: this.baseCls}, true);
                
        if(this.id){
            this.el.dom.id = this.id;
        }
		var wrapDom = this.el.dom;
        this.progressBar = Ext.get(wrapDom.firstChild);

        if (this.textEl) {
            //use an external text el
            this.textEl = Ext.get(this.textEl);
        } else {
            //setup our internal layered text els
            this.textEl = Ext.get(wrapDom.childNodes[1]);
            this.textEl.setWidth(wrapDom.clientWidth);
        }
        this.progressBar.setHeight(wrapDom.clientHeight);
    },
    // private
    afterRender : function(){
        Ext.ux.PercentageBar.superclass.afterRender.call(this);
        if(this.value){
            this.updateProgress(this.value, this.text);
        }else{
            this.updateText(this.text);
        }
    },

    /**
     * Updates the percentage bar value, and optionally its text.  If the text argument is not specified,
     * any existing text value will be unchanged.  To blank out existing text, pass ''.  Note that even
     * if the progress bar value exceeds 1, it will never automatically reset -- you are responsible for
     * determining when the progress is complete and calling {@link #reset} to clear and/or hide the control.
     * @param {Float} value (optional) A floating point value between 0 and 1 (e.g., .5, defaults to 0)
     * @param {String} text (optional) The string to display in the progress text element (defaults to '')
     * @param {Boolean} animate (optional) Whether to animate the transition of the percentage bar. If this value is
     * not specified, the default for the class is used (default to false)
     * @return {Ext.ux.PercentageBar} this
     */
    
 	updateProgress: function(value, text, animate){
        this.value = value || 0;
        if(text){
            this.updateText(text);
        }
        if(this.rendered && !this.isDestroyed){
            var w = Math.floor(value*this.el.dom.clientWidth);
            this.progressBar.setWidth(w, animate === true || (animate !== false && this.animate));
        }
        this.fireEvent('update', this, value, text);
        return this;
    },
    /**
     * Sets the size of the percentage bar.
     * @param {Number} width The new width in pixels
     * @param {Number} height The new height in pixels
     * @return {Ext.ux.PercentageBar} this
     */
    setSize: function(w, h){
        Ext.ux.PercentageBar.superclass.setSize.call(this, w, h);
        if(this.textTopEl){
            var wrapDom = this.el.dom;
            this.textEl.setSize(wrapDom.clientWidth, wrapDom.clientHeight);
        }
        this.syncProgressBar();
        return this;
    },

    /**
     * Resets the percentage bar value to 0 and text to empty string.  If hide = true, the percentage
     * bar will also be hidden (using the {@link #hideMode} property internally).
     * @param {Boolean} hide (optional) True to hide the percentage bar (defaults to false)
     * @return {Ext.ux.PercentageBar} this
     */
    reset: function(hide){
        this.updateProgress(0);
        this.clearTimer();
        if (hide === true) {
            this.hide();
        }
        return this;
    },
    onDestroy: function() {
        this.clearTimer();
        if (this.rendered) {
            Ext.destroyMembers(this, 'textEl', 'progressBar');
        }
        Ext.ux.PercentageBar.superclass.onDestroy.call(this);
    }
});
Ext.reg('ux_percentagebar', Ext.ux.PercentageBar);