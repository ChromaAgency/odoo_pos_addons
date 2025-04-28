from odoo import models, fields

class Product(models.Model):
    _inherit = 'product.product'

    def _load_pos_data_fields(self, config_id):
        # Implement the method logic here
        return super()._load_pos_data_fields(config_id) + ['qty_available', 'virtual_available']