from odoo.api import model
from odoo.models import Model 
from odoo.fields import Char, Many2one
import logging 
_logger = logging.getLogger(__name__)
class PosOrder(Model):
    _inherit = 'pos.order'

    cancel_reason = Char(string='Motivo')

    @model
    def _order_fields(self, ui_order):
        fields = super()._order_fields(ui_order)
        fields.update({
            'cancel_reason': ui_order.get('cancel_reason', ''),
        })
        return fields

    @model
    def _process_order(self, order, draft, existing_order):
        pos_order_id = super()._process_order(order, draft, existing_order)
        pos_order = self.browse([pos_order_id])
        if pos_order.cancel_reason:
            pos_order.action_pos_order_cancel()
        return pos_order_id
        