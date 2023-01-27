odoo.define('pos_restaurant_delivery.DeliveryOrderWidget', function(require) {
	'use strict';

	const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
	const Registries = require('point_of_sale.Registries');
	const { useListener } = require('web.custom_hooks');
	const rpc = require('web.rpc');
	var core = require('web.core');
    var _t = core._t;
	// formerly DeliveryOrderWidgetWidget
	class DeliveryOrderWidget extends AbstractAwaitablePopup {

		constructor({popupProps, ...props}) {
			var {name,
				mobile,
				email,
				address,
				street,
				city,
				zip,
				person_id,
				order_note,
				delivery_date,
				order
				} = popupProps
			super(...arguments);
			this.name = name;
			this.mobile = mobile;
			this.email = email;
			this.address = address;
			this.street = street;
			this.city = city;
			this.zip = zip;
			this.person_id = person_id;
			this.order_note = order_note;
			this.delivery_date = delivery_date;
			this.order = order;
		}

		mounted() {
			$('#dell_date').datetimepicker({
				format: 'YYYY-MM-DD HH:mm:ss',
				inline: true,
				sideBySide: true
			});


			$('.delivery-detail').hide();

			$('#delivery_date').hide();
			$('#street').hide();
			$('#zip').hide();
			$('#mobile').hide();
			$('#d_name').hide();
			$('#city').hide();
			$('#address').hide();
			$('#delivery_person').hide();
			$('#dd_date').hide();

			$('#form1,#apply_shipping_address').click(function() {
				if ($('#apply_shipping_address').is(':checked')) {
					$('#apply_shipping_address').prop('checked', false);
				}
				else{
					$('#apply_shipping_address').prop('checked', true);
				}

				if ($('#apply_shipping_address').is(':checked')) {
					$('.delivery-detail').show();
					$('#default').hide()
				} else {
					$('.delivery-detail').hide();
					$('#default').show()

					$('#delivery_date').hide();
					$('#street').hide();
					$('#zip').hide();
					$('#mobile').hide();
					$('#d_name').hide();
					$('#city').hide();
					$('#address').hide();
					$('#delivery_person').hide();
					$('#dd_date').hide();
				}
			});
		}

		async create() {
			let self = this;
			let order = {...this.order};

			let delivery_person_id = $('.person_id').val(); 
			let other_addrs = $("#apply_shipping_address").is(':checked') ? 1 : 0;
			
			let delivery_date = $('#my_date').val();
			let dd_date = new Date(delivery_date);

			if (!order.id){
				const orders = await rpc.query({
					model: 'pos.order',
				method: 'search',
				args: [ [['pos_reference','like',this.uid]]],
				kwargs:{
					"limit":1
				}
			}
				)
				order.id = orders[0]
			}
			const rpc_response = rpc.query({
				model: 'pos.order',
				method: 'save_delivery_order_data',
				args: [[order.id], {
					delivery_person_id,
					delivery_order:true,
					delivery_date
				}],
			}) 
			$.when(rpc_response).done(()=>self._closePopup.bind(self)(true));
		}

		_closePopup(confirmed){
				this.props.resolve({ confirmed, payload: null });
				this.trigger('close-popup');
		}

		cancel() {
			this._closePopup(false)
		}

		clear() {
			$('.detail').val('');
			$('.d_name').focus();
		}
	}
	DeliveryOrderWidget.template = 'DeliveryOrderWidget';
	DeliveryOrderWidget.defaultProps = {
		confirmText: 'Select',
		cancelText: 'Cancel',
		clearText: 'Clear',
		title: 'Home Delivery Order',
		body: '',
	};

	Registries.Component.add(DeliveryOrderWidget);

	return DeliveryOrderWidget;
});
