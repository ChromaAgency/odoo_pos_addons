# -*- coding: utf-8 -*-

import logging
from datetime import timedelta
from functools import partial

import psycopg2
import pytz

from odoo import api, fields, models, tools, _
from odoo.tools import float_is_zero, float_round
from odoo.exceptions import ValidationError, UserError
from odoo.http import request
from odoo.osv.expression import AND
import base64

_logger = logging.getLogger(__name__)

class ProductProduct(models.Model):
	_inherit = 'product.product'
	
	is_home_delivery_charge = fields.Boolean('Delivery Charge')


class PosConfig(models.Model):
	_inherit = 'pos.config'

	pos_verify_delivery = fields.Boolean(string='Home Delivery')


class AccountJournal(models.Model):
	_inherit = 'account.journal'

	is_home_delivery = fields.Boolean('Use as Home Delivery', help='if you use this journal as home delivery, it will not create any payment entries for that order')


class account_journal(models.Model):
	_inherit = 'pos.payment.method'

	is_home_delivery = fields.Boolean(string='Use as Home Delivery',related='cash_journal_id.is_home_delivery',readonly=False)  


	@api.model
	def create(self,vals):
		methods = self.search_count([('is_home_delivery','=',True)])
		if 'is_home_delivery' in vals:
			if vals.get('is_home_delivery') == True:
				if methods >= 1:
					raise UserError(_("Already one payment selected as home delivery , you can not create multiple home delivery methods."))
		return super(account_journal,self).create(vals)


	def write(self,vals):
		methods = self.search_count([('is_home_delivery','=',True)])
		if 'is_home_delivery' in vals:
			if vals.get('is_home_delivery') == True:
				if methods >= 1:
					raise UserError(_("Already one payment selected as home delivery , you can not create multiple home delivery methods."))
		return super(account_journal,self).write(vals)
