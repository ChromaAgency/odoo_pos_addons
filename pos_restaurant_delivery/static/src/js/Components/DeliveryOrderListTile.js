odoo.define('pos_restaurant_delivery.DeliveryOrderListTile', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const { useListener } = require('web.custom_hooks');
    let core = require('web.core');
	let _t = core._t;
    const Registries = require('point_of_sale.Registries');
    var rpc = require('web.rpc');

    class DeliveryOrderListTile extends PosComponent {
        constructor() {
            super(...arguments);
        }
        mounted() {
        }
        willUnmount() {
        }
        get date(){
            return this.delivery_date || this.order.order_date

        }
        get name(){
            return this.order.name
            
        }
        get address(){
            return this.order.address
            
        }
        get phone(){
            return this.order.phone
            
        }
        get amount_total(){
            return this.order.amount_total.toFixed(2)
            
        }
        get amount_return(){
            return this.order.amount_return.toFixed(2)
            
        }
        get total_cash_to_return(){
            return this.order.total_cash_to_return.toFixed(2)
            
        }
        get delivery_date(){
            return this.order.delivery_date
        }

        get order() {
            return this.props.order;
        }
        async setInProgress(order_rec) {
            
            let res = await rpc.query({
                model: 'pos.order',
                method: 'make_delivery_in_progress',
                args: [[this.order.id]],
            });
            this.trigger('refresh-orders',this);
            alert('Order is out for delivery.');
            
        }
        async setPayed(order_rec) {
            let res = await rpc.query({
                model: 'pos.order',
                method: 'make_delivery_payment',
                args: [[this.order.id]],
            });
            this.trigger('refresh-orders',this);
            alert('Payment completed and order has been updated to "Paid" state.');
            
        }
        
        async setCancel(order_rec) {
            const cancelReason = await this.showPopup('CancelReasonPopup', {
                title: 'Cancel Reason',
                body: `${this.name} has total amount of ${this.amount_total}, are you sure you want delete this order?`,
            });
            let res = await rpc.query({
                model: 'pos.order',
                method: 'make_delivery_cancel',
                args: [[this.order.id],cancelReason.payload],
            });
            this.trigger('refresh-orders',this);
            alert('Order has been updated to "Cancelled" state.');
            
        }

  

    }
    DeliveryOrderListTile.template = 'DeliveryOrderListTile';


    Registries.Component.add(DeliveryOrderListTile);
    return DeliveryOrderListTile;
});