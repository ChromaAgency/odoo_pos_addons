odoo.define('pos_restaurant_delivery.BiReceiptScreen', function(require) {
	"use strict";

	const ReceiptScreen = require('point_of_sale.ReceiptScreen');
	const Registries = require('point_of_sale.Registries');

	const BiReceiptScreen = ReceiptScreen => 
		class extends ReceiptScreen {
			constructor() {
				super(...arguments);
			}

			get showPendingDeliveryButton(){
				console.log({env:this.env})
				return this.env.pos?.config?.pos_verify_delivery;
			}
	};

	Registries.Component.extend(ReceiptScreen, BiReceiptScreen);

	return ReceiptScreen;
});