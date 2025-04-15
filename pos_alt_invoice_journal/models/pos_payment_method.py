from odoo import models, fields, api

class PosPaymentMethod(models.Model):
    _inherit = 'pos.payment.method'

    secondary_journal_id = fields.Many2one('account.journal', string='Receivable Secondary Journal')