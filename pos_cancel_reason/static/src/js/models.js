odoo.define('pos_cancel_reason.models',
  ['point_of_sale.models'], function(require, factory) {
  'use strict';

  var exports = require('point_of_sale.models');
  var _super_order = exports.Order.prototype
  exports.Order = exports.Order.extend({
    initialize: function(attributes,options){
      var order = _super_order.initialize.apply(this, arguments);
      if (!this.client){
        var client = this.pos.db.get_partner_by_id(7);
        if (!client) {
                  console.error('ERROR: trying to load a partner not available in the pos');
              }
        else{
            this.set_client(client)
          }
      }
      return order;
    },
    export_as_JSON:function(){
        var json = _super_order.export_as_JSON.apply(this,arguments);
        json.cancel_reason = this.cancel_reason;
        return json;
    },
   
  });

  exports.load_fields('pos.order',['cancel_reason'])
  
  return exports
});