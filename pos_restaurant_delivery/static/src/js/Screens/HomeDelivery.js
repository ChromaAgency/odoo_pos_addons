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

			var partner_id = false
			if (order.get_client() != null)
				partner_id = order.get_client();

			if (!partner_id) {
				self.showPopup('ErrorPopup', {
					'title': _t('Unknown customer'),
					'body': _t('You cannot use Home Delivery. Select customer first.'),
				});
				return;
			}       

			var props =  {
				'title': _t('Home Delivery Order'),
				'name' : "",
				'email' : order.get_div_email(),
				'mobile' : order.get_div_mobile(),
				'address' : order.get_div_location(),
				'street' : order.get_div_street(),
				'city' : order.get_div_city(),
				'zip' : order.get_div_zip(),
				'delivery_date' : order.get_delivery_date(),
				'person_id' : order.get_div_person(),
				'order_note' : order.get_div_note(),
				order
			}
			self.showPopup('DeliveryOrderWidget',props);
        }
    }
    HomeDelivery.template = 'HomeDelivery';


    Registries.Component.add(HomeDelivery);

    return HomeDelivery;
});
