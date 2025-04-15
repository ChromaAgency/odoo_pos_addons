{
    'name': 'POS Alt Invoice Journal',
    'version': '18.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Change journal when invoice field is not set in POS',
    'description': """
        This module modifies the POS behavior to use a different journal when
        the invoice field is not set during invoice creation.
    """,
    'depends': ['point_of_sale', 'parallel_accounting'],
    'data': [
        'views/pos_payment_method.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}