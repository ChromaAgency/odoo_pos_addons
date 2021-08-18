# -*- coding: utf-8 -*-
{
    'name': "Listas de precios multimoneda",

    'summary': """Poder agregar listas de precios en todas las monedas posibles""",

    'description': """
    Poder agregar listas de precios en todas las monedas posibles
    """,

    'author': "Making Argentina",
    'website': "https://making.com.ar",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/13.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Sales',
    'version': '0.1',
    'installable':True,
    # any module necessary for this one to work correctly
    
    'depends': [ 
        'point_of_sale'
    ],
    # always loaded
    'data': [
        'views/assets.xml'
    ],
    'qweb':[
    ],
}