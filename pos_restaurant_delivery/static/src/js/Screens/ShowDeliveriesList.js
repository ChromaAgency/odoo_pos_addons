odoo.define('pos_restaurant_delivery.ShowEmployeeButton',function(require){
"use strict";
    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');
    var core = require('web.core');
    var _t = core._t;
    var rpc = require('web.rpc');

    class ShowEmployeeButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }

        async onClick() {
            var self = this;
            var employees = await this._GetEmployees();
            await self.showTempScreen('DeliveriesList', {
                'title': _t('Assigned Employees'),
                'allEmployees': employees,
            });
        }

        async _GetEmployees() {
            var employees = await rpc.query({
                model: 'pos.order',
                method: 'get_employees',
                args: [],
            });
            return employees;
        }
    }

    ShowEmployeeButton.template = 'ShowEmployeeButton';

    ProductScreen.addControlButton({
        component: ShowEmployeeButton,
        condition: function () {
            return this.env.pos.config.pos_verify_delivery;
        },
    });

    Registries.Component.add(ShowEmployeeButton);

    return ShowEmployeeButton;
});

odoo.define('pos_restaurant_delivery.DeliveriesList',function(require){
"use strict";
	const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');
    var core = require('web.core');
    var _t = core._t;
    var rpc = require('web.rpc');

    class DeliveriesList extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
        }
        get allemployees() {
            return this.props.allEmployees;
        }
        cancel() {
			this.trigger('close-temp-screen');
		}
		

    }
    DeliveriesList.template = 'DeliveriesList';

	Registries.Component.add(DeliveriesList);

    return DeliveriesList;
});

odoo.define('pos_restaurant_delivery.ShowDeliveryOrderWidget',function(require){
"use strict";
	const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');
    var core = require('web.core');
    var _t = core._t;
    var rpc = require('web.rpc');

    class DeliveriesOrderList extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
        }
        get allorders() {
            return this.props.allOrders;
        }
        async cancel() {
			var self = this;
            var employees = await this._GetEmployees();
            await self.showTempScreen('DeliveriesList', {
                'title': _t('Assigned Employees'),
                'allEmployees': employees,
            });
		}
		async _GetEmployees() {
            var employees = await rpc.query({
                model: 'pos.order',
                method: 'get_employees',
                args: [],
            });
            return employees;
        }
         
    }

    DeliveriesOrderList.template = 'DeliveriesOrderList';

	Registries.Component.add(DeliveriesOrderList);

    return DeliveriesOrderList;
});