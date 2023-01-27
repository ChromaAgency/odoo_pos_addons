odoo.define('pos_cancel_reason.TicketScreen', ['point_of_sale.TicketScreen','point_of_sale.Registries'], function (require) {
    'use strict';

    const TicketScreen = require('point_of_sale.TicketScreen');
    const Registries = require('point_of_sale.Registries');

    const PosCancelReasonTicketScreen = (TicketScreen) =>
        class extends TicketScreen {
          async deleteOrder(order){
            const screen = order.get_screen_data();
            if (['ProductScreen', 'PaymentScreen'].includes(screen.name) && order.get_orderlines().length > 0) {
                const { confirmed, payload } = await this.showPopup('CancelReasonPopup', {
                    title: 'Cancel Reason',
                    body: `${order.name} has total amount of ${this.getTotal(
                        order
                    )}, are you sure you want delete this order?`,
                });
                if (!confirmed) return;
                order.cancel_reason = payload;
            }
              this.env.pos.push_single_order(order);
              super.deleteOrder(order);
          }
        };

    Registries.Component.extend(TicketScreen, PosCancelReasonTicketScreen);

    return TicketScreen;
});
