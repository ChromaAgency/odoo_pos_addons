odoo.define('pos_restaurant_delivery.pos_delivery', function (require) {
	"use strict";
	const { Context } = owl; 

	var core = require('web.core');
	var _t = core._t;
	var models = require('point_of_sale.models');
	var rpc = require('web.rpc');


	models.load_models({
		model:  'product.product',
		fields: ['display_name', 'list_price','price','pos_categ_id', 'taxes_id', 'barcode', 'default_code', 
		'to_weight', 'uom_id', 'description_sale', 'description', 'categ_id', 'product_tmpl_id','tracking','is_home_delivery_charge'],
			domain: [['sale_ok','=',true],['available_in_pos','=',true]], //['is_home_delivery_charge','=',true]
			loaded: function(self, product_delivery){
				self.product_delivery = product_delivery;
				self.get_products = [];
				self.get_products_by_id = [];
			},   
		});


	var OrderlineCollection = Backbone.Collection.extend({
		model: models.Orderline,
	});
	var PaymentlineCollection = Backbone.Collection.extend({
		model: models.Paymentline,
	});
	var OrderCollection = Backbone.Collection.extend({
		model: models.Order,
	});
	var _super_posmodel = models.PosModel.prototype;
	models.PosModel = models.PosModel.extend({
		
		initialize: function (session, attributes) {
			var product_model = _.find(this.models, function(model){ return model.model === 'res.partner'; });
			product_model.fields.push('street2');

			var payment_method = _.find(this.models, function(model){ return model.model === 'pos.payment.method'; });
			payment_method.fields.push('is_home_delivery');
			this.set({
				'pendingDeliveryOrders': new OrderCollection(),
			})
			return _super_posmodel.initialize.call(this, session, attributes);
		},
		
		get_pending_orders: async function (){ 
			var orders = await rpc.query({
				model: 'pos.order',
				method: 'get_order_without_delivery_from_session',
				args: [ this.pos_session.id]})

			orders.forEach((order,i)=>{

				var order = new models.DeliveryOrder(order, {pos:this})
				this.get("pendingDeliveryOrders").add(order)
			} )
	}
	});

	var posorder_super = models.Order.prototype;
	models.DeliveryOrder = models.Order.extend({
		initialize: function(attr, options) {
			// posorder_super.initialize.call(this,attr,options);
			Backbone.Model.prototype.initialize.apply(this, arguments);
			var self = this;
			options  = options || {};
	
			this.locked         = false;
			this.pos            = options.pos;
			this.selected_orderline   = undefined;
			this.selected_paymentline = undefined;
			this.screen_data    = {};  // see Gui
			this.temporary      = options.temporary || false;
			this.creation_date  = new Date();
			this.to_invoice     = false;
			this.orderlines     = new OrderlineCollection();
			this.paymentlines   = new PaymentlineCollection();
			this.pos_session_id = this.pos.pos_session.id;
			this.employee       = this.pos.employee;
			this.finalized      = false; // if true, cannot be modified.
			this.set_pricelist(this.pos.default_pricelist);
			
			var partner = attr.partner_id
			if (partner){

				var client = this.pos.db.get_partner_by_id(partner[0]);
				if (!client) {
					console.error('ERROR: trying to load a partner not available in the pos');
				}
				else{
					this.set_client(client)
				}
			}
	
			this.uiState = {
				ReceiptScreen: new Context({
					inputEmail: '',
					// if null: not yet tried to send
					// if false/true: tried sending email
					emailSuccessful: null,
					emailNotice: '',
				}),
				TipScreen: new Context({
					inputTipAmount: '',
				})
			};
			this.init_from_JSON(attr)
		},
		set_delivery_data: function(fields){
			this.d_name = fields.d_name;
			this.mobile = fields.mobile;
			this.email = fields.email;
			this.address = fields.address;
			this.street = fields.street;
			this.city = fields.city;
			this.zip = fields.zip || "";
			this.delivery_date = fields.delivery_date;
			this.person_id = fields.person_id;
			this.order_note = fields.order_note;
			this.trigger('change',this);
		},
		set_delivery_status: function(delivery){
			this.delivery = delivery;
			this.trigger('change',this);
		},
		get_delivery_status: function(delivery){
			return this.delivery;
		},
		get_div_name:function(d_name){
			return this.d_name;
		},
		get_div_email:function(email){
			return this.email;
		},
		get_div_mobile:function(mobile){
			return this.mobile;
		},
		get_div_location:function(address){
			return this.address;
		},
		get_div_street:function(street){
			return this.street;
		},
		get_div_city:function(city){
			return this.city;
		},
		get_div_zip:function(zip){
			return this.zip;
		},
		get_delivery_date:function(delivery_date){
			return this.delivery_date;
		},
		get_div_person:function(person_id){
			return this.person_id;
		},
		get_div_note:function(order_note){
			return this.order_note;
		},
		export_as_JSON: function() {
			var json = posorder_super.export_as_JSON.apply(this,arguments);
			json.d_name = this.get_div_name();
			json.email = this.get_div_email();
			json.mobile = this.get_div_mobile();
			json.address = this.get_div_location();
			json.street = this.get_div_street();
			json.city = this.get_div_city();
			json.zip = this.get_div_zip();
			json.delivery_date = this.get_delivery_date();
			json.person_id = this.get_div_person();
			json.order_note = this.get_div_note();
			json.delivery = this.get_delivery_status();
			return json;
		},
		init_from_JSON: function(json){
			// posorder_super.init_from_JSON.apply(this,arguments);
			this.set_delivery_data(json);
			this.delivery = json.delivery;
			
		},
	});

});
