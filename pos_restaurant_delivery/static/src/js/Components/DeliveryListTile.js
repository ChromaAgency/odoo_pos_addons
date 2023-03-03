odoo.define('pos_restaurant_delivery.DeliveryListTile', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    let core = require('web.core');
	let _t = core._t;
    const Registries = require('point_of_sale.Registries');
    var rpc = require('web.rpc');

    class DeliveryListTile extends PosComponent {
        constructor() {
            super(...arguments);
        }
        mounted() {
        }
        willUnmount() {
        }
        get employee() {
            return this.props.employee;
        }
        get name(){
            return this.employee.name
        }
        get total_orders(){
            return this.employee.total_orders
        }
        get amount_total(){
            return this.employee.amount_total.toFixed(2)
        }
        get amount_return(){
            return this.employee.amount_return.toFixed(2)
        }
        get amount_return_total() {
            return this.employee.total_cash_to_return.toFixed(2)
        }

        async _onClickEmployee() {
		    var self = this;
            var orders = await this._getDeliveryOrders(this.employee.id);
            self.showTempScreen('DeliveriesOrderList', {
                'title': _t('Delivery Orders'),
                employeeId:this.employee.id
            });

        }
        async setInProgress(){
            await rpc.query({
                model: 'pos.order',
                method: 'mark_all_deliveries_in_progress_for',
                args: [this.employee.id],
            });
            this.trigger('refresh-orders',this);
        }

        async setPayed(){
            await rpc.query({
                model: 'pos.order',
                method: 'mark_all_deliveries_payed_for',
                args: [this.employee.id],
            });
            this.trigger('refresh-orders',this);
        }
        
        
        async _getDeliveryOrders(employeeId) {
            
            return await this.env.pos.get_employee_unfinished_orders(employeeId);
        }
      

  

    }
    DeliveryListTile.template = 'DeliveryListTile';


    Registries.Component.add(DeliveryListTile);
    return DeliveryListTile;
});