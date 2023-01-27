from odoo import models, fields


class HrEmployee(models.Model):
    _inherit = 'hr.employee'

    is_delivery = fields.Boolean(string="Is Delivery?", default=True)
    delivery_order_ids = fields.One2many('pos.order', 'delivery_person_id', string="Ordenes de delivery")
    pending_delivery_order_ids = fields.One2many('pos.order','delivery_person_id', string="Ordenes de delivery", compute="_compute_pending_delivery_order_count")
    pending_delivery_order_count = fields.Integer(string="Total de ordenes pendientes", compute="_compute_pending_delivery_order_count")

    def _compute_pending_delivery_order_count(self):
        for rec in self:
            pending_delivery_order_ids = rec.delivery_order_ids.filtered(lambda r: r.delivery_state not in ["paid",'cancel'])
            rec.pending_delivery_order_ids = pending_delivery_order_ids
            rec.pending_delivery_order_count = len(pending_delivery_order_ids)