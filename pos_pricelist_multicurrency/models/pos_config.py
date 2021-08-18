from odoo import _
from odoo.models import Model
from odoo.exceptions import ValidationError
from odoo.api import constrains
class PosConfig(Model):
  _inherit = 'pos.config'

  @constrains('pricelist_id', 'use_pricelist', 'available_pricelist_ids', 'journal_id', 'invoice_journal_id', 'payment_method_ids')
  def _check_currencies(self):
    try:
      super(PosConfig,self)._check_currencies()
    except ValidationError:
      if any(
            self.payment_method_ids\
                .filtered(lambda pm: pm.is_cash_count)\
                .mapped(lambda pm: self.currency_id not in (self.company_id.currency_id | pm.cash_journal_id.currency_id))
        ):
            raise ValidationError(_("All payment methods must be in the same currency as the Sales Journal or the company currency if that is not set."))
            


