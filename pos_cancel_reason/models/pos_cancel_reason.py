from odoo.models import Model 
from odoo.fields import Char, Many2one

class PosCancelReason(Model):
    _name = 'pos.cancel.reason'

    name = Char(string='Motivo')
    order_id = Many2one('pos.order',string="Pedido")