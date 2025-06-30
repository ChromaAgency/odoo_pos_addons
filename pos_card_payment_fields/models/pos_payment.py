from odoo import models, fields, api
import logging
_logger = logging.getLogger(__name__)

class PosPayment(models.Model):
    _inherit = 'pos.payment'

    lot = fields.Char(string='Lot')
    coupon = fields.Char(string='Coupon')
    terminal = fields.Char(string='Terminal')

    @api.model
    def _payment_fields(self, order, ui_paymentline):
        fields = super()._payment_fields(order, ui_paymentline)
        _logger.info(f'ui_paymentline: {ui_paymentline}')
        fields.update({
            'lot': ui_paymentline.get('lot', False),
            'coupon': ui_paymentline.get('coupon', False),
            'terminal': ui_paymentline.get('terminal', False),
        })
        return fields
