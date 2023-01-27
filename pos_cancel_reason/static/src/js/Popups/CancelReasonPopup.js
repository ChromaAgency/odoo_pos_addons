odoo.define('pos_cancel_reason.CancelReasonPopup', function(require) {
    'use strict';

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { useRef } = owl.hooks;

    class CancelReasonPopup extends AbstractAwaitablePopup {
        constructor(){
            super(...arguments)
            this.cancelRef = useRef('cancel-reason')
        }
        async getPayload(){
            super.getPayload()
            return this.cancelRef.el.value

        }
    }
    CancelReasonPopup.template = 'CancelReasonPopup';
    CancelReasonPopup.defaultProps = {
        confirmText: 'Ok',
        cancelText: 'Cancel',
        title: 'Confirm ?',
        body: '',
    };

    Registries.Component.add(CancelReasonPopup);

    return CancelReasonPopup;
});
