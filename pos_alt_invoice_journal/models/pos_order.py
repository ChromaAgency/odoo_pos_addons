from odoo import models

class PosOrder(models.Model):
    _inherit = 'pos.order'

    def _apply_invoice_payments(self, is_reverse=False):
        #Overwrited from native odoo function of same name
        accounting_partner = self.env["res.partner"]._find_accounting_partner(self.partner_id).with_company(self.company_id)
        #Changed only this to adapt to parallel accounting
        receivable_account = accounting_partner.property_account_receivable_id if self.to_invoice else accounting_partner.property_receivables_secondary_account_id
        payment_moves = self.payment_ids.sudo().with_company(self.company_id)._create_payment_moves(is_reverse)
        if receivable_account.reconcile:
            invoice_receivables = self.account_move.line_ids.filtered(lambda line: line.account_id == receivable_account and not line.reconciled)
            if invoice_receivables:
                credit_line_ids = payment_moves._context.get('credit_line_ids', None)
                payment_receivables = payment_moves.mapped('line_ids').filtered(
                    lambda line: (
                        (credit_line_ids and line.id in credit_line_ids) or
                        (not credit_line_ids and line.account_id == receivable_account and line.partner_id)
                    )
                )
                (invoice_receivables | payment_receivables).sudo().with_company(self.company_id).reconcile()
        return payment_moves

    def _process_saved_order(self, order_data):
        _ = super(PosOrder, self)._process_saved_order(order_data)
        line_values_list = self._prepare_tax_base_line_values()
        if not self.to_invoice and self.state == 'paid' and line_values_list:
            self._generate_pos_order_invoice()
        return _

    def _prepare_invoice_vals(self):
        vals = super(PosOrder, self)._prepare_invoice_vals()
        if not self.to_invoice and self.state == 'paid':
            vals['journal_id'] = self.config_id.journal_id.id
        return vals
