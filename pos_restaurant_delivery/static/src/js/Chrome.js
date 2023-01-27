odoo.define('pos_restaurant_delivery.Chrome', function(require) {
    'use strict';
    const Chrome = require('point_of_sale.Chrome')
    const Registries = require('point_of_sale.Registries');
    const DeliveryChrome = Chrome =>
    class extends Chrome {
        constructor() {
            super(...arguments);
        }

        get isPendingOrderScreenShown() {
            return this.mainScreen.name === 'PendingDeliveryScreen';
        }
    }
    Registries.Component.extend(Chrome, DeliveryChrome);
});
