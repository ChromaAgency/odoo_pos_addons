odoo.define('pos_restaurant_delivery.ShowOrderButton',function(require){
"use strict";

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');
    var core = require('web.core');
    var _t = core._t;
    var rpc = require('web.rpc');

    class ShowOrderButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }

        async onClick() {
            var self = this;
            var orders = await this._GetOrders();
            await self.showTempScreen('ShowOrdersWidget', {
                'title': _t('Delivery Orders')
            });
        }

        async _GetOrders() {
            var orders = await this.env.pos.get_unfinished_orders()
            return orders;
        }

    }

    ShowOrderButton.template = 'ShowOrderButton';

    ProductScreen.addControlButton({
        component: ShowOrderButton,
        condition: function () {
            return this.env.pos.config.pos_verify_delivery;
        },
    });

    Registries.Component.add(ShowOrderButton);

    return ShowOrderButton;
});

odoo.define('pos_restaurant_delivery.ShowOrdersWidget',function(require){
"use strict";
	const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');
    var rpc = require('web.rpc');
    const {useState} = owl.hooks;

    class ShowOrdersWidget extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
            useListener('refresh-orders', this._onRefreshOrders);
            this.state = useState({allOrders:this.env.pos.get("pendingDeliveryOrders").models || []});
   
        }
        async _onRefreshOrders (){
            const orders = await this.env.pos.get_unfinished_orders()
            this.state.allOrders = orders
        }
        get allorders() {
            return  this.state.allOrders;
        }
        cancel() {
			this.trigger('close-temp-screen');
		}

     
    }
    ShowOrdersWidget.template = 'ShowOrdersWidget';

	Registries.Component.add(ShowOrdersWidget);

    return ShowOrdersWidget;
});

