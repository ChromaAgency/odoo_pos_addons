{
    'name': 'Check stock quantities in POS',
    'version': '1.0',
    'summary': 'Raise Warning if the stock quantity is less than the minimum stock quantity in POS',
    'description': 'A warning is raised when the stock quantity es less then the stock on hand.',
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
            'avinoa/static/src/js/**/*',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,

}