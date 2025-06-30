from odoo import _
from odoo.models import Model
from odoo.exceptions import ValidationError
from odoo.api import constrains


class PosConfig(Model):
    _inherit = 'pos.config'

    @constrains('pricelist_id', 'use_pricelist', 'available_pricelist_ids', 'journal_id', 'invoice_journal_id', 'payment_method_ids')
    def _check_currencies(self):
        for config in self:
            try:
                super()._check_currencies()
            except ValidationError:
                # Check if the config's payment methods are compatible with its currency
                for pm in config.payment_method_ids:
                    if pm.journal_id and pm.journal_id.currency_id and pm.journal_id.currency_id != config.currency_id:
                        raise ValidationError(_("All payment methods must be in the same currency as the Sales Journal or the company currency if that is not set."))

