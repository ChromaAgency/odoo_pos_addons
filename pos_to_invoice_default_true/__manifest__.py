{
    'name': 'Default invoice to True in POS',
    'version': '1.0',
    'summary': 'Default invoice to True in POS',
    'description': 'Makes the invoice button to .',
    'category': 'Custom',
    'depends': ['base', 'point_of_sale', ],
    'data': [
        # List your data files here
    ],
    'demo': [
        # List your demo files here
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_to_invoice_default_true/static/src/js/**/*',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,

}