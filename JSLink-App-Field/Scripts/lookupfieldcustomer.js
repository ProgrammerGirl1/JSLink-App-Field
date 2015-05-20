/* JavaScript SharePoint Custom Column Appearance file *
 * @version 1.0
 * Author - Programmer Girl
 * Changes a text field over to a TokenInput lookup field.
 * Can work with either an internal list, or an external web service.
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
    PGRL.lookupfieldcustomer = (function () {
        function _lookupfieldcustomer() {

            /*
            * In non-strict mode, 'this' is bound to the global scope when it isn't bound to anything else.
            * In strict mode it is 'undefined'. That makes it an error to use it outside of a method.
            */

            var _this = this,

            /*
             * These are private properties to assign the initial field
             * and list variables, so the methods know what they're supposed
             * to be changing.
            */
            _lookupFieldName = "CustomerNameLookup",
            _lookupFieldTitle = "Customer Name",
            _lookupListTitle = "Customers",
            _lookupListFieldName = "CustomerName",
            _lookupValueSeparator = ";#",

            /*
             * Gets the list items for the lookup TokenInput control
             * This is the private method not meant for use as a public method.
             * Accepts three parameters url, listname, fieldName
             *      url : The url of the service to call to get the data
             *      listname: The name of the list to lookup (if looking up data in SharePoint)
             *      fieldName : The name of the field to lookup (if looking up data in SharePoint)
            */
            _getListItem = function (url, listname, fieldName) {
                $.ajax({
                    url: url,
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        _getListItem_Complete(data, _lookupFieldName);
                    },
                    error: function (data) {
                        _getListItem_Failure(data, _lookupFieldName);
                    }
                });
            },

            /*
             * Runs if the _getListItems AJAX call completed successfully
             * to map the data to a JSON output expected by the TokenInput
             * control.
             * Note: if using an internal list for lookup data, and mapping
             * from that, please use following syntax for $map:
             * - - - $.map(data.d.results, function (item, i) { - - -
             * If using an external web service URL, you're more likely to need:
             * - - - $.map(data.d, function (item, i) { - - -
             * This is the private method not meant for use as a public method.
             * Accepts two parameters data, fieldName
             *      data : The data returned from the AJAX call
             *      fieldName : The name of the field so it can be called by its ID
            */
            _getListItem_Complete = function (data, fieldName) {
                var customers = [];

                customers = $.map(data.d.results, function (item, i) {
                    return {
                        id: item.Title,
                        name: item.CustomerName
                    };
                });

                var itemValue;
                var itemText;
                var existingValue = $("#" + fieldName).val();

                if (existingValue === null || existingValue === "" || existingValue === undefined) {
                    $("#" + fieldName).tokenInput(customers, {
                        theme: "facebook",
                        tokenDelimiter: _lookupValueSeparator,
                        hintText: "Type in a customer name",
                        tokenLimit: 1,
                        preventDuplicates: true,
                    });
                }
                else {

                    existingValue = existingValue.split(_lookupValueSeparator);
                    var existingValues = new Array();
                    $.each(existingValue, function (index, customerName) {
                        if (index % 2 === 1) {
                            itemText = customerName;
                            existingValues.push(
                                { id: itemValue, name: itemText }
                            );
                        }
                        else {
                            itemValue = customerName;
                        }
                    });

                    $("#" + fieldName).tokenInput(customers, {
                        theme: "facebook",
                        prePopulate: existingValues,
                        tokenDelimiter: _lookupValueSeparator,
                        hintText: "Type in a customer name",
                        tokenLimit: 1,
                        preventDuplicates: true,
                    });
                }

                PGRL.helper.closeWaitDialog();
            },

            /*
             * Runs if the _getListItems AJAX call failed
             * This is the private method not meant for use as a public method.
             * Accepts one parameter data
             *      data : The data returned from the failed AJAX call
            */
            _getListItem_Failure = function (data) {
                console.log(data.statusText);
                console.log(data.responseText);
                PGRL.helper.closeWaitDialog();
            },

            /*
             * Initialises the control
             * This is the private method not meant for use as a public method.
             * Accepts two parameters listTitle, fieldName
             *      listTitle : The name of the list to lookup (if using SharePoint data)
             *      fieldName : The name of the field to lookup (if using SharePoint data)
            */
            _initControl = function (listTitle, fieldName) {
                PGRL.helper.showWaitDialog();

                var listUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listTitle + "')/items";

                _getListItem(listUrl, listTitle, fieldName);
            },

            /*
             * Construct the display template
             * Accepts one parameter ctx
             *      ctx : The context passed in (with field and value information)
             * Return the value to display.
            */
            _displayTemplate = function (ctx) {
                if (ctx != null && ctx.CurrentFieldValue != null) {
                    var fieldVal = ctx.CurrentFieldValue.toString();
                    var res = fieldVal.split(";#");
                    return res[1];
                }
                return '';
            },

            /*
             * Construct the view template
             * Accepts one parameter ctx
             *      ctx : The context passed in (with field and value information)
             * Return the value to display.
            */
            _viewTemplate = function (ctx) {
                if (ctx != null && ctx.CurrentItem != null) {
                    var fieldVal = ctx.CurrentItem[_lookupFieldName].toString();
                    var res = fieldVal.split(";#");
                    return res[1];
                }
                return '';
            },

            /*
             * Construct the edit (and new) template
             * Accepts one parameter ctx
             *      ctx : The context passed in (with field and value information)
             * Return the value to display.
            */
            _editTemplate = function (ctx) {
                var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
                var fieldName = formCtx.fieldName;
                var fieldTitle = formCtx.fieldSchema.Title
                var fieldValue = formCtx.fieldValue != null ? formCtx.fieldValue : '';

                formCtx.registerGetValueCallback(formCtx.fieldName, function () {
                    var selectedValue = null;
                    var selectedItems = $("#" + formCtx.fieldName).tokenInput("get");
                    $.each(selectedItems, function (index, selectedItem) {
                        if (selectedValue === null) {
                            selectedValue = selectedItem.id + _lookupValueSeparator + selectedItem.name;
                        }
                        else {
                            selectedValue = selectedValue + _lookupValueSeparator + selectedItem.id + _lookupValueSeparator + selectedItem.name;
                        }
                    });
                    document.getElementById(fieldName).value = selectedValue;
                    return document.getElementById(fieldName).value;
                });

                formCtx.registerInitCallback(formCtx.fieldName, function () {
                    _initControl(_lookupListTitle, _lookupListFieldName);
                });

                /* Setup validation */
                var validators = new SPClientForms.ClientValidation.ValidatorSet();
                if (formCtx.fieldSchema.Required) {
                    validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator());
                }
                if (validators._registeredValidators.length) {
                    formCtx.registerClientValidator(formCtx.fieldName, validators);
                }
                formCtx.registerValidationErrorCallback(formCtx.fieldName, function (errorResult) {
                    //SPFormControl.AppendValidationErrorMessage(formCtx.fieldName, errorResult);
                    if ($("#" + fieldName + "TokenFieldError").length) {
                        if (errorResult.errorMessage.length == 0) {
                            $("#" + fieldName + "TokenFieldError").hide();
                        }
                        else {
                            $("#" + fieldName + "TokenFieldError").html("<span role='alert'>" + errorResult.errorMessage + "</span>");
                            $("#" + fieldName + "TokenFieldError").show();
                        }
                    }
                });

                var html = "<div dir=\"none\">" +
                                "<input id=\"" + fieldName + "\" " +
                                    "class=\"ms-long ms-spellcheck-true\" " +
                                    "title=\"" + fieldTitle + "\" " +
                                    "maxLength=\"255\" " +
                                    "value=\"" + fieldValue + "\" " +
                                    "type=\"text\">" +
                                "<span id=\"" + fieldName + "TokenFieldError\" class=\"ms-formvalidation ms-csrformvalidation\" style=\"display:none;\"></span>" +
                                "</div>";

                return html;
            };

            this.init = function () {
                var customersFieldContext = {};
                customersFieldContext.Templates = {};
                customersFieldContext.Templates.Fields = {
                    "CustomerNameLookup": {
                        "NewForm": _editTemplate,
                        "EditForm": _editTemplate,
                        "DisplayForm": _displayTemplate,
                        "View": _viewTemplate
                    }
                };

                SPClientTemplates.TemplateManager.RegisterTemplateOverrides(customersFieldContext);

                return this; /*returning this from a method is a common way to allow "chaining" of methods together*/
            };

            return this.init(); /*this refers to PGRL.lookupfieldcustomer.init()*/
        }

        return new _lookupfieldcustomer(); /*creating a new object of lookupfieldcustomer rather then a function*/
    }());

    /**
    * Check to evaluate whether 'PGRL' exists in the global namespace - if not, assign window.PGRL an object literal
    */
}(window.PGRL = window.PGRL || {}, jQuery));