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
                console.log(this.props)
            if (this.props.isPendingOrderScreenShown) {
                console.log('close')
                posbus.trigger('close-screen');
            } else {
				self.showScreen('PendingDeliveryScreen',
				{
					pendingOrders: await self._getPendingOrders()
				})
            }
        }
		async _getPendingOrders() {
            await this.env.pos.get_pending_orders()
            var pendingOrders = this.env.pos.get("pendingDeliveryOrders");
            var {models } = pendingOrders
            return models || []; 
        }
    } 
    PendingDeliveryButton.template = 'PendingDeliveryButton';


    Registries.Component.add(PendingDeliveryButton);

    return PendingDeliveryButton;
});
