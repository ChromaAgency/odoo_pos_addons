odoo.define('pos_pricelist_multicurrency.SetPricelistButton', function(require) {
    'use strict';
    
    const Registries = require('point_of_sale.Registries');
    const SetPricelistButton = require('point_of_sale.SetPricelistButton');

    const FilteredPricelistSetPricelistButton = ()=>
    
     class extends SetPricelistButton{
        
        async onClick() {
            // Create the list to be passed to the SelectionPopup.
            // Pricelist object is passed as item in the list because it
            // is the object that will be returned when the popup is confirmed.
            console.log(this.env.pos.currencies)
            const selectionList = this.env.pos.pricelists.filter(pricelist => this.env.pos.currency.id === pricelist.currency_id[0]).map(pricelist => ({
                id: pricelist.id,
                label: pricelist.name,
                isSelected: pricelist.id === this.currentOrder.pricelist.id,
                item: pricelist,
            }));

            const { confirmed, payload: selectedPricelist } = await this.showPopup(
                'SelectionPopup',
                {
                    title: this.env._t('Select the pricelist'),
                    list: selectionList,
                }
            );

            if (confirmed) {
                this.currentOrder.set_pricelist(selectedPricelist);
            }
        }
    }



    Registries.Component.extend(SetPricelistButton, FilteredPricelistSetPricelistButton);

    return FilteredPricelistSetPricelistButton;
});
