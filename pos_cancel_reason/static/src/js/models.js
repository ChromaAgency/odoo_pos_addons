odoo.define('pos_cancel_reason.models',
  ['point_of_sale.models'], function(require, factory) {
  'use strict';

  var exports = require('point_of_sale.models');
  var _super_order = exports.Order.prototype
  exports.Order = exports.Order.extend({

    export_as_JSON:function(){
        var json = _super_order.export_as_JSON.apply(this,arguments);
        json.cancel_reason = this.cancel_reason;
        return json;
    },
   
  });

  exports.load_fields('pos.order',['cancel_reason'])
  
  return exports
});