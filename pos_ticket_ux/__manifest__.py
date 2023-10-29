# -*- coding: utf-8 -*-

{
    'name': 'POS Ticket Addons',
    'version': '1.0.0',
    'category': 'Point of sale',
    'summary': 'Add to pos ticket',
    'description': """ 
        Add different stuff to the POS ticket
    """,
    'depends': ['point_of_sale'],
    'data': [],
    'installable': True,
    'assets': {
        'point_of_sale.assets': [
            'pos_ticket_ux/static/src/js/**/*.js',
            'pos_ticket_ux/static/src/xml/**/*.xml',
        ]
        },
    'application': True
}
