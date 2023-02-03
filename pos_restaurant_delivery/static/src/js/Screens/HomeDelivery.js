odoo.define('pos_restaurant_delivery.HomeDelivery', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    let core = require('web.core');
	let _t = core._t;
    const Registries = require('point_of_sale.Registries');
    var rpc = require('web.rpc');

    class HomeDelivery extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }

		get order() {
			return this.props.order;
		}
        async onClick() {
            var self = this;
			var order = this.order;
			this.env.person_ids = await rpc.query({
                model: 'pos.order',
                method: 'get_delivery_persons',
                args: [[]],
            });

			var customer = order.get_client()

			if (!customer || customer == null) {
				self.showPopup('ErrorPopup', {
					'title': _t('Unknown customer'),
					'body': _t('You cannot use Home Delivery. Select customer first.'),
				});
				return;
			}       
			
			var props =  {
				'title': _t('Home Delivery Order'),
				'name' : "",
				'email' : customer.email,
				'mobile' : customer.mobile,
				'address' : customer.address,
				'street' : customer.street,
				'city' : customer.city,
				'zip' : customer.zip,
				'delivery_date' : order.delivery_date,
				'person_id' : order.delivery_person_id,
				'order_note' : order.order_note,
				order
			}
			self.showPopup('DeliveryOrderWidget',props).then(()=>{
				this.trigger('refresh-orders',this);

			});
        }
    }
    HomeDelivery.template = 'HomeDelivery';


    Registries.Component.add(HomeDelivery);

    return HomeDelivery;
});
