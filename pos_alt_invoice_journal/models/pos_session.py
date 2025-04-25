from odoo import models, fields, _
from collections import defaultdict
from odoo.tools import float_is_zero, float_compare 
import logging

_logger = logging.getLogger(__name__)
class PosSession(models.Model):
    _inherit = 'pos.session'

    def _get_split_receivable_vals(self, payment, amount, amount_converted):
        data = super()._get_split_receivable_vals(payment, amount, amount_converted)
        if not payment.pos_order_id.to_invoice:
            accounting_partner = self.env["res.partner"]._find_accounting_partner(payment.partner_id)
            data['account_id'] = accounting_partner.property_receivables_secondary_account_id.id
        return data

    def _create_split_account_payment(self, payment, amounts):
        payment_method = payment.payment_method_id
        if not payment_method.journal_id:
            return self.env['account.move.line']
        outstanding_account = payment_method.outstanding_account_id if payment.pos_order_id.to_invoice else (payment_method.secondary_journal_id or payment_method.journal_id).default_account_id
        accounting_partner = self.env["res.partner"]._find_accounting_partner(payment.partner_id)
        receivable_account = accounting_partner.property_account_receivable_id if payment.pos_order_id.to_invoice else accounting_partner.property_receivables_secondary_account_id
        destination_account = receivable_account

        if float_compare(amounts['amount'], 0, precision_rounding=self.currency_id.rounding) < 0:
            # revert the accounts because account.payment doesn't accept negative amount.
            outstanding_account, destination_account = destination_account, outstanding_account

        account_payment = self.env['account.payment'].create({
            'amount': abs(amounts['amount']),
            'partner_id': payment.partner_id.id,
            'journal_id': payment_method.journal_id.id if payment.pos_order_id.to_invoice else payment_method.secondary_journal_id.id or payment_method.journal_id.id,
            'force_outstanding_account_id': outstanding_account.id,
            'destination_account_id': destination_account.id,
            'memo': _('%(payment_method)s POS payment of %(partner)s in %(session)s', payment_method=payment_method.name, partner=payment.partner_id.display_name, session=self.name),
            'pos_payment_method_id': payment_method.id,
            'pos_session_id': self.id,
        })
        account_payment.action_post()
        return account_payment.move_id.line_ids.filtered(lambda line: line.account_id == receivable_account)


    def _get_split_statement_line_vals(self, journal_id, amount, payment):
        vals = super()._get_split_statement_line_vals(journal_id, amount, payment)
        accounting_partner = self.env["res.partner"]._find_accounting_partner(payment.partner_id)
        if not payment.pos_order_id.to_invoice:
            vals['journal_id'] = payment.payment_method_id.secondary_journal_id.id,
            vals['counterpart_account_id'] = accounting_partner.property_receivables_secondary_account_id.id,
        return vals

    def _accumulate_amounts(self, data):
        # ! We inspire this in the original func.
        # Accumulate the amounts for each accounting lines group
        # Each dict maps `key` -> `amounts`, where `key` is the group key.
        # E.g. `combine_receivables_bank` is derived from pos.payment records
        # in the self.order_ids with group key of the `payment_method_id`
        # field of the pos.payment record.
        data = super()._accumulate_amounts(data)
       
        amounts = lambda: {'amount': 0.0, 'amount_converted': 0.0}
        split_receivables_bank = defaultdict(amounts)
        split_receivables_cash = defaultdict(amounts)
        combine_receivables_bank = defaultdict(amounts)
        combine_receivables_cash = defaultdict(amounts)
        split_inv_payment_receivable_lines = defaultdict(lambda: self.env['account.move.line'])
        split_invoice_receivables = defaultdict(amounts)
        combine_inv_payment_receivable_lines = defaultdict(lambda: self.env['account.move.line'])
        combine_invoice_receivables = defaultdict(amounts)
        # We  erase combine receivables bank and cash to not duplicate payments as we only support this in split payments
        data['combine_receivables_bank'] = combine_receivables_bank
        data['combine_receivables_cash'] = combine_receivables_cash
        data['split_inv_payment_receivable_lines'] = split_inv_payment_receivable_lines
        data['split_invoice_receivables'] = split_invoice_receivables
        data['combine_inv_payment_receivable_lines'] = combine_inv_payment_receivable_lines
        data['combine_invoice_receivables'] = combine_invoice_receivables

        currency_rounding = self.currency_id.rounding
        pos_receivable_account = self.company_id.account_default_pos_receivable_account_id

        closed_orders = self._get_closed_orders()
        for order in closed_orders:
            order_is_invoiced = order.is_invoiced
            for payment in order.payment_ids:
                amount = payment.amount
                if float_is_zero(amount, precision_rounding=currency_rounding):
                    continue
                date = payment.payment_date
                payment_method = payment.payment_method_id
                payment_type = payment_method.type

                # If not pay_later, we create the receivable vals for both invoiced and uninvoiced orders.
                #   Separate the split and aggregated payments.
                # Moreover, if the order is invoiced, we create the pos receivable vals that will balance the
                # pos receivable lines from the invoice payments.
                if payment_type != 'pay_later':
                    if payment_type == 'cash':
                        split_receivables_cash[payment] = self._update_amounts(split_receivables_cash[payment], {'amount': amount}, date)
                    elif payment_type == 'bank':
                        split_receivables_bank[payment] = self._update_amounts(split_receivables_bank[payment], {'amount': amount}, date)

                    # Create the vals to create the pos receivables that will balance the pos receivables from invoice payment moves.
                    if order_is_invoiced:
                        split_inv_payment_receivable_lines[payment] |= payment.account_move_id.line_ids.filtered(lambda line: line.account_id == pos_receivable_account)
                        split_invoice_receivables[payment] = self._update_amounts(split_invoice_receivables[payment], {'amount': payment.amount}, order.date_order)
        data['split_receivables_bank'] = split_receivables_bank
        data['split_receivables_cash'] = split_receivables_cash
        data['split_inv_payment_receivable_lines'] = split_inv_payment_receivable_lines
        data['split_invoice_receivables'] = split_invoice_receivables

        return data