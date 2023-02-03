odoo.define('pos_restaurant_delivery.PendingDeliveryButton', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    let core = require('web.core');
	let _t = core._t;
    const Registries = require('point_of_sale.Registries');
    const { posbus } = require('point_of_sale.utils');
    var rpc = require('web.rpc');

    class PendingDeliveryButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }

        async onClick() {
			var self = this;
            if (this.props.isPendingOrderScreenShown) {
                posbus.trigger('close-screen');
            } else {
                await this._getPendingOrders()
				self.showScreen('PendingDeliveryScreen',{
                'title': _t('Delivery Orders')

                })
            }
        }
		async _getPendingOrders() {
            
            var pendingOrders = await this.env.pos.get_pending_orders()
            return pendingOrders || []; 
        }
    } 
    PendingDeliveryButton.template = 'PendingDeliveryButton';


    Registries.Component.add(PendingDeliveryButton);

    return PendingDeliveryButton;
});
