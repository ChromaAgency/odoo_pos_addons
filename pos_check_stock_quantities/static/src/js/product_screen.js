/** @odoo-module **/
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(ProductScreen.prototype, {
    async addProductToOrder(product) {
        const hasStock =  product.qty_available > 0;
        const lineQty = (this.currentOrder
            .get_orderlines()
            .find((line) => line.product_id.id === product.id)?.qty || 0)
        const stockIsLessThanQtyAvailable = product.qty_available <= lineQty;
        if (product.is_storable && !hasStock || stockIsLessThanQtyAvailable) {
            this.dialog.add(AlertDialog, {
                title: _t(`No hay stock del producto`),
                body: _t(
                    `El producto ${product.display_name} no posee stock`
                ),
            });
            return ;
        }
            return await super.addProductToOrder(product);
    }
   
});
