# -*- coding: utf-8 -*-
{
    'name': "Final price on pos",

    'summary': """""",

    'description': """""",

    'author': "Chroma Agency",
    'website': "https://chroma.agency",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/13.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Sales',
    'version': '1.0',
    'installable': True,
    # any module necessary for this one to work correctly
    'depends': [ 
        'point_of_sale'
    ],
    # always loaded
    'data': [],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_final_price/static/src/xml/**/*',
        ],
    },
}