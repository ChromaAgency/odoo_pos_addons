from odoo import models, api
import logging

_logger = logging.getLogger(__name__)

class PosOrder(models.Model):
    _inherit = 'pos.order'
     
    def _process_saved_order(self, order_data):
        _ = super(PosOrder, self)._process_saved_order(order_data)
        line_values_list = self._prepare_tax_base_line_values()
        if not self.to_invoice and self.state == 'paid' and line_values_list:
            self._generate_pos_order_invoice()
        return _

    def _prepare_invoice_vals(self):
        vals = super(PosOrder, self)._prepare_invoice_vals()
        if 'invoice_payment_term_id' in vals:
            vals['invoice_payment_term_id'] = self.partner_id.property_payment_term_id.id
        if not self.to_invoice and self.state == 'paid':
            vals['journal_id'] = self.config_id.journal_id.id
        return vals

class PosSession(models.Model):
    _inherit = 'pos.session'
    
    def _get_split_statement_line_vals(self, journal_id, amount, payment):
        vals = super()._get_split_statement_line_vals(journal_id, amount, payment)
        if not payment.pos_order_id.to_invoice:
            if 'invoice_payment_term_id' in vals:
                vals['invoice_payment_term_id'] = payment.pos_order_id.partner_id.property_payment_term_id.id
        return vals


