odoo.define('pos_ticket_ux.OrderReceipt', function (require) {
    'use strict';

    console.log( "OrderReceipt setup" );

    const OrderReceipt = require('point_of_sale.OrderReceipt');
    const Registries = require('point_of_sale.Registries');

    const PosTicketUxOrderReceipt = (OrderReceipt) =>
        class extends OrderReceipt {
        };

    Registries.Component.extend(OrderReceipt, PosTicketUxOrderReceipt);

    return OrderReceipt;
});
