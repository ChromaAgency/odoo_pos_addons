# -*- coding: utf-8 -*-

{
    'name': 'POS Delivery Order in Odoo',
    'version': '14.0.0.1',
    'category': 'Point of sale',
    'summary': 'app helps to manage point of sales home delivery feature on POS cash on Delivery details pos home delivery POS Delivery pos order home Delivery Pickup Call In POS order pickup pos Call In order delivery pos order delivery POS Retail delivery pos order pos ordering food ordering pos COD ',
    'description': """ 

    odoo Create home delivery in point of sale home delivery POS
	odoo Point of Sales Home Delivery point of sales Odoo
	Odoo POS Home Delivery on POS door step delivery
	Odoo send order to Home Delivery on Point of Sales Odoo
	odoo Pos Pay Later POs Pay after delivery point of sales POS door step delivery odoo
	odoo POS Pay delivery point of sales home delivery
	odoo pos delivery Point of sale payment after delivery POS payment home delivery
	odoo POS home delivery payment POS cash on delivery POS 
	odoo POS COD POS Odoo
    odoo Point of sale COD Point of sales Odoo
    odoo Point of sales COD on Point of sales Odoo COD on POS
    Odoo Point of sale cash on delivery point of sales odoo
    POS Point of sales cash on delivery on POS Odoo cash on delivery on point of sales
    This Odoo apps is designed to allow Home Delivery option to POS-Point of sale orders in odoo. 
    With this module you can make customer get their desired products delivered to door-step. 
    Also you can keep track on status of that order. 
    It also allows you to know till what time customer should get products delivered to their door-step delivery Odoo. 
    Any special note can also be added while creating Order.

""",
    'depends': ['pos_restaurant','hr', 'pos_cancel_reason'],
    'data': ['data/data.xml','views/pos_delivery_template.xml', 'views/pos_delivery_view.xml', 'views/hr_employee_views.xml'],
    'qweb': [
        'static/src/xml/DatetimeWidget.xml',
        'static/src/xml/HomeDelivery.xml',
        'static/src/xml/DeliveryOrder.xml',
        'static/src/xml/ShowOrderButton.xml',
        'static/src/xml/ShowOrderWidget.xml',
        'static/src/xml/DeliveriesList.xml',
        'static/src/xml/PendingDeliveryButton.xml',
        'static/src/xml/PendingDeliveryScreen.xml',
        'static/src/xml/Chrome.xml',
        'static/src/xml/ReceiptScreen/ReceiptScreen.xml',
        'static/src/xml/ReceiptScreen/OrderReceipt.xml',
        'static/src/xml/Components/DeliveryOrderListTile.xml',
        'static/src/xml/Components/DeliveryListTile.xml',
    ],
    'installable': True,
    'application': True
}
