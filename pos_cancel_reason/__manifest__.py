# -*- coding: utf-8 -*-
{
    'name': "Motivo de borrado de ordenes",

    'summary': """Borrado de ordenes con motivo""",

    'description': """
        Borrar ordenes con un motivo especifico
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
      'views/assets.xml',
      'views/pos.order.xml',
    ],
    'qweb':[
      'static/src/xml/Popups/CancelReasonPopup.xml'
          ],
}