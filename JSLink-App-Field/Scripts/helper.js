/* JavaScript SharePoint App helper file *
 * @version 1.0
 * Author - Programmer Girl
 * This helper file features a number of methods from the helper file
 * created by Mohammed Arif for JavaScript Boilerplate
 * https://github.com/mdarif/JavaScript-Boilerplate
*/

(function (PGRL, $, undefined) {
    'use strict';

    /*
     * Singletons serve as a namespace provider which isolate implementation code
     * from the global namespace so as to provide a single point of access for functions;
     * this is useful for organising code into logical sections.
     * It is possible to put parentheses around this structure to instantiate it immediately after it's parsed.
     * This way it's always present when the script is executed and doesn't have to be instantiated separately.
    */
    PGRL.helper = (function () {
        function _helper() {

            /*
            * In non-strict mode, 'this' is bound to the global scope when it isn't bound to anything else.
            * In strict mode it is 'undefined'. That makes it an error to use it outside of a method.
            */

            /*jshint validthis: true */
            var _this = this,

            /* This keeps track of the "loading" modal dialog in SharePoint */
            _waitDialog = null,

            /*
             * This method returns the element using javaScript getElementById() method.
             * This is the private method not meant for use as a public method.
            */
            id = function (el) {
                return document.getElementById(el);
            },

            /*
             * This is a private method to call the SharePoint modal dialog
            */
            _showWaitDialog = function () {
                try {
                    if (_waitDialog == null) {
                        _waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Processing...', 'Please wait while request is in progress...', 100, 430);
                    }
                } catch (ex) { }
            };

            /*
             * Replace multiple values in a single string.
             * Accept two parameters str, hash
             *      str : String on which replace operation is to be performed
             *      hash : JSON object contain string to be replaced with there replaced value
             * Return the new string at the end.
            */
            this.multiReplace = function (str, hash) {
                var key;
                for (key in hash) {
                    if (Object.prototype.hasOwnProperty.call(hash, key)) {
                        str = str.replace(new RegExp(key, 'g'), hash[key]);
                    }
                }
                return str;
            };

            /*
             * Set the CSS on a particular element
             * Accept two parameters el, styles
             *      el : The name of element on which CSS is to be apply.
             *      styles : Various CSS property with their values. Accept data in JSON format
             * This method calls a private method setStyle
            */
            this.setCSS = function (el, styles) {
                var prop;
                for (prop in styles) {
                    if (styles.hasOwnProperty(prop)) {
                        _this.setStyle(el, prop, styles[prop]);
                    }
                }
            };

            /*
             * Apply the CSS to the given element
             * Accept three parameters elements, prop, val
             *      element : The element on which CSS is to be apply.
             *          This method will automatically search for element using getElementById() method.
             *      prop : CSS properties
             *      val : Value for CSS property
            */
            this.setStyle = function (el, prop, val) {
                id(el).style[prop] = val;
            };

            /*
             * Check if the given element has given class assign or not.
             * Accept two parameters el, name
             *      el : Element for testing. This method will search for element using JavaScript getElementById() method.
             *      name : name of class to be test
             * This method return true and false
            */
            this.hasClass = function (el, name) {
                el = id(el);
                return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
            };

            /*
             * Add class to the given element
             * Accept two parameters el, name
             *      el : element on which class to be add
             *      name : name of class
            */
            this.addClass = function (el, name) {
                if (!_this.hasClass(el, name)) {
                    el = id(el);
                    el.className += (el.className ? ' ' : '') + name;
                }
            };

            /*
             * Remove class from given element
             * Accept two parameters el, name
             *      el : element from which class is to be remove
             *      name : name of the class to be remove
            */
            this.removeClass = function (el, name) {
                if (_this.hasClass(el, name)) {
                    el = id(el);
                    el.className = el.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
                }
            };

            /*
             * This method will check for blank value in the provided string
             * This will return true if provided string contain blank value and false if not
            */
            this.isBlank = function (string) {
                var isNonblank_re = /\S/;
                return String(string).search(isNonblank_re) === -1;
            };

            /*
             * Get the requested parameter from the querystring
             * Accept one parameter param
             *      param: the parameter to find the value of in the querystring
             * Return the value of the parameter (if found)
            */
            this.getQueryStringParameter = function (param) {
                var params = document.URL.split("?")[1].split("&");
                var strParams = "";
                for (var i = 0; i < params.length; i = i + 1) {
                    var singleParam = params[i].split("=");
                    if (singleParam[0] == param) {
                        return singleParam[1];
                    }
                }
            };

            /*
             * Show the SharePoint modal dialog to indicate something is loading
            */
            this.showWaitDialog = function () {
                //ExecuteOrDelayUntilScriptLoaded(_showWaitDialog, "sp.js");
                SP.SOD.executeFunc('sp.js', 'SP.UI.ModalDialog', _showWaitDialog);
            };

            /* Close the SharePoint modal dialog that indicates something is loading
            */
            this.closeWaitDialog = function () {
                try {
                    if (_waitDialog != null) {
                        _waitDialog.close();
                        _waitDialog = null;
                    }
                } catch (ex) { }
                return _waitDialog;
            };

            this.init = function () {
                return this; /*returning this from a method is a common way to allow "chaining" of methods together*/
            };

            return this.init(); /*this refers to PGRL.helper.init()*/
        }

        return new _helper(); /*creating a new object of helper rather then a function*/
    }());

    /**
    * Check to evaluate whether 'PGRL' exists in the global namespace - if not, assign window.PGRL an object literal
    */
}(window.PGRL = window.PGRL || {}, jQuery));