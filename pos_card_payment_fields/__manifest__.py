# -*- coding: utf-8 -*-

{
    'name': 'POS Card payment fields',
    'version': '1.0.0',
    'category': 'Point of sale',
    'summary': 'Add fields to checkout when paying with cards',
    'description': """ 
        Add fields to checkout when paying with cards
    """,
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_payment_views.xml',
    ],
    'installable': True,
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_card_payment_fields/static/src/js/**/*.js',
            'pos_card_payment_fields/static/src/xml/**/*.xml',
        ]
        },
    'application': True
}
