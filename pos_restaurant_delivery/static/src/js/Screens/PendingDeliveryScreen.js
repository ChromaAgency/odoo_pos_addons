odoo.define('pos_restaurant_delivery.PendingDeliveryScreen', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const IndependentToOrderScreen = require('point_of_sale.IndependentToOrderScreen');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    let core = require('web.core');
	let _t = core._t;
    const Registries = require('point_of_sale.Registries');
    const { posbus } = require('point_of_sale.utils');
    var rpc = require('web.rpc');
    const {useState} = owl.hooks;

    class PendingDeliveryScreen extends IndependentToOrderScreen {
        constructor() {
            super(...arguments);
            useListener('close-screen', this.close);
            useListener('refresh-orders', this._onRefreshOrders);
            this.state = useState({allOrders:this.env.pos.get("pendingDeliveryOrders").models || []});
        }
        async _onRefreshOrders (){
            console.log('refresh')
            const orders = await this.env.pos.get_pending_orders()
            this.state.allOrders = orders
        }
        mounted() {
            posbus.on('close-screen', this, this.close);
        }
        willUnmount() {
            posbus.off('close-screen', this);
        }
        get pendingOrders() {
            return this.state.allOrders
        }


    }
    PendingDeliveryScreen.template = 'PendingDeliveryScreen';


    Registries.Component.add(PendingDeliveryScreen);
    return PendingDeliveryScreen;
});