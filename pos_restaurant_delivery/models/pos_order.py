# -*- coding: utf-8 -*-

import logging
from datetime import datetime

from dateutil import parser
from dateutil.relativedelta import relativedelta
from odoo import _, api, fields, models, tools
from odoo.api import model, returns
from odoo.exceptions import UserError
from odoo.tools import float_is_zero

_logger = logging.getLogger(__name__)

def get_pos_order_vals_from_dict(delivey_order_vals, pos_orders_vals_by_id):
	pos_order_id = delivey_order_vals.get('id',[None,])	
	if not pos_order_id: raise Exception("No hay una orden asociada a este delivery")
	return pos_orders_vals_by_id.get(pos_order_id)

class PosOrder(models.Model):
	_inherit = 'pos.order'

	delivery_order = fields.Boolean(string='Is Home Delivery Order')
	delivery_date = fields.Datetime('Delivery Time', index=True)
	delivery_person_id = fields.Many2one('hr.employee', 'Delivery Person', index=True, domain=[('is_delivery', '=', True)])
	partner_shipping_id = fields.Many2one('res.partner', string='Delivery Address', help="Delivery address for current sales order.")
	delivery_state = fields.Selection([
		('draft', 'Assigned'),
		('in_progress', 'Out for Delivery'),
		('delivered', 'Delivered'),
		('paid', 'Paid'),
		('cancel', 'Cancel'),
	], string='States', default='draft')
	total_cash_to_return = fields.Float(string="Efectivo total a devolver", help="Total cash the delivery has to give to the commerce, composed of all the cash payments, + change", compute="_compute_total_cash_to_return")

	def _compute_total_cash_to_return(self):
		for rec in self:
			cash_payments = rec.payment_ids.filtered(lambda r: r.payment_method_id.is_cash_count == True)
			positive_cash_payments = cash_payments.filtered(lambda r: r.amount > 0)
			if not rec.delivery_person_id:
				rec.total_cash_to_return = 0
			if positive_cash_payments:
				rec.total_cash_to_return = sum(pay.amount for pay in positive_cash_payments)
			else:
				rec.total_cash_to_return = sum(abs(pay.amount) for pay in cash_payments)

	def save_delivery_order_data(self, delivery_order_data):
		return self.write(delivery_order_data)

	def make_delivery_in_progress(self):
		_logger.info(self)
		self.delivery_state = 'in_progress'
		return True

	def make_delivery_delivered(self):
		self.delivery_state = 'delivered'
		return True

	def make_delivery_draft(self):
		self.delivery_state = 'draft'
		return True

	def make_delivery_cancel(self, cancel_reason):
		self.cancel_reason = cancel_reason
		self.delivery_state = 'cancel'
		return True

	def make_delivery_payment(self):
		for rec in self:
			delivery_journals = []
			amount = rec.amount_paid  - rec.amount_total
			for journal in rec.session_id.config_id.payment_method_ids:
				if journal.is_home_delivery and journal.is_cash_count : 
					delivery_journals.append(journal.id)

			if not delivery_journals:
				raise UserError(_('Please Define Home Delivery Journal..'))
			if amount <= 0.0:
				data = {
					'name': _('Home/Delivery'),
					'amount': -amount,
					'payment_date': fields.Datetime.now(),
					'payment_method_id': delivery_journals[0] if delivery_journals else False,
					'pos_order_id': rec.id,
				}

				rec.add_payment(data)
				rec.write({'delivery_state': 'paid'})
			else:
				rec.write({'delivery_state': 'paid'})
	
	def _get_pos_order_vals_by_id(self):
		return {pos_order_vals.get("id"):pos_order_vals for pos_order_vals in self.read(['amount_total','amount_paid','amount_return'])}
		
	def get_all_delivery_orders(self):
		orders = self.search([('delivery_order','=',True)])
		order_vals = []
		pos_orders_vals_by_id = orders._get_pos_order_vals_by_id()
		for vals in orders.read():
			pos_order_vals = get_pos_order_vals_from_dict(vals, pos_orders_vals_by_id)	    			
			vals['amount_total'] = round(pos_order_vals.get('amount_total'), 2)
			vals['amount_return'] = -round(pos_order_vals.get('amount_paid'), 2)
			order_vals.append(vals)
		return order_vals
	
	def _get_pending_orders(self):
		return self.search([('delivery_state', 'not in', ['paid', 'cancel']),('delivery_order','=', True)])

	def get_pending_orders_vals(self):
		pending_orders = self._get_pending_orders()
		pending_orders_vals = []
		pos_orders_vals_by_id = pending_orders._get_pos_order_vals_by_id()
		for order_vals in pending_orders.read():
			vals = order_vals
			pos_order_vals = get_pos_order_vals_from_dict(order_vals, pos_orders_vals_by_id)	
			vals['amount_total'] = round(pos_order_vals.get('amount_total'), 2)
			vals['amount_return'] = -round(pos_order_vals.get('amount_paid'), 2)
			pending_orders_vals.append(vals)
		return pending_orders_vals

	@model
	def get_employees(self):
		orders = self._get_pending_orders()
		employees = orders.mapped('delivery_person_id')
		recs = []
		for emp_vals in employees.sudo().read(['name','pending_delivery_order_count','pending_delivery_order_ids']):
			emp_orders = self.search([('delivery_person_id', '=', emp_vals.get('id')), ('delivery_state','not in',['paid', 'cancel'])])  
			amount_total = 0
			amount_return = 0
			total_cash_to_return = 0
			for o in emp_orders:
				amount_total += o.amount_total
				amount_return +=  o.amount_return
				total_cash_to_return += o.total_cash_to_return
			emp_vals['amount_total'] = round(amount_total, 2)
			emp_vals['amount_return'] = round(amount_return, 2)
			emp_vals['total_cash_to_return'] = total_cash_to_return
			emp_vals['total_orders'] = emp_vals.get("pending_delivery_order_count",0)
			recs.append(emp_vals)
		return recs

	@model
	def get_employee_delivery_orders(self, employee_id):
		orders = self.search([('delivery_person_id', '=', employee_id), ('delivery_state', 'not in', ['paid', 'cancel'])])
		recs = []
		pos_orders_vals_by_id = orders._get_pos_order_vals_by_id()
		for order_vals in orders.read():
			pos_order_vals = get_pos_order_vals_from_dict(order_vals, pos_orders_vals_by_id)	
			order_vals['amount_total'] = round(pos_order_vals.get('amount_total'), 2)
			order_vals['amount_return'] = round(pos_order_vals.get('amount_return'), 2) 
			recs.append(order_vals)
		return recs

	def set_delivery_person(self,  delivery_person_id):
		self.write({'delivery_person_id': delivery_person_id})
		if self.delivery_person_id:
			self.make_delivery_in_progress()
		return True

	def get_delivery_persons(self):
		employees = self.env['hr.employee'].sudo().search([('is_delivery', '=', True)])
		return employees.read(['id', 'name'])

	def write(self, vals):
		for order in self:
			if order.name == '/' and order.delivery_order :
				vals['name'] = order.config_id.sequence_id._next()
		return super(PosOrder, self).write(vals)

	@model
	def mark_all_deliveries_in_progress_for(self, employee_id):
		self.search([('delivery_person_id','=',employee_id),('state','not in', ['paid','cancel'])]).make_delivery_in_progress()

	@model
	def mark_all_deliveries_delivered_for(self, employee_id):
		self.search([('delivery_person_id','=',employee_id),('state','not in', ['paid','cancel'])]).make_delivery_delivered()
		
	@model
	def mark_all_deliveries_payed_for(self, employee_id):
		self.search([('delivery_person_id','=',employee_id),('delivery_state','not in',['paid','cancel'])]).make_delivery_payment()

	@model
	def get_order_without_delivery_from_session(self, session_id): 
		return self.search_read([('session_id','=',session_id), ('delivery_person_id','=',False),('delivery_state','not in',['paid','cancel']),('state','not in',['paid','cancel'])])

	def _process_payment_lines(self, pos_order, order, pos_session, draft):
		"""Create account.bank.statement.lines from the dictionary given to the parent function.

		If the payment_line is an updated version of an existing one, the existing payment_line will first be
		removed before making a new one.
		:param pos_order: dictionary representing the order.
		:type pos_order: dict.
		:param order: Order object the payment lines should belong to.
		:type order: pos.order
		:param pos_session: PoS session the order was created in.
		:type pos_session: pos.session
		:param draft: Indicate that the pos_order is not validated yet.
		:type draft: bool.
		"""
		prec_acc = order.pricelist_id.currency_id.decimal_places

		order_bank_statement_lines= self.env['pos.payment'].search([('pos_order_id', '=', order.id)])
		order_bank_statement_lines.unlink()
		if not order.delivery_order :
			for payments in pos_order['statement_ids']:
				if not float_is_zero(payments[2]['amount'], precision_digits=prec_acc):
					order.add_payment(self._payment_fields(order, payments[2]))

		order.amount_paid = sum(order.payment_ids.mapped('amount'))

		if not draft and not float_is_zero(pos_order['amount_return'], prec_acc):
			cash_payment_method = pos_session.payment_method_ids.filtered('is_cash_count')[:1]
			if not cash_payment_method:
				raise UserError(_("No cash statement found for this session. Unable to record returned cash."))
			return_payment_vals = {
				'name': _('return'),
				'pos_order_id': order.id,
				'amount': -pos_order['amount_return'],
				'payment_date': fields.Date.context_today(self),
				'payment_method_id': cash_payment_method.id,
			}
			order.add_payment(return_payment_vals)