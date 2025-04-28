import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { _t } from "@web/core/l10n/translation";

console.log("loaded")

patch(PosOrderline.prototype, {

     set_quantity(quantity, keep_price) {
        const stockLessThanQuantity = this.product_id.qty_available < quantity
        if (this.product_id.is_storable && stockLessThanQuantity) {
            return {
                title: _t("No hay stock suficiente del producto"),
                body: _t(
                     `El producto ${this.product_id.display_name} no posee stock`
                ),
            };;
        }
        
        return super.set_quantity(quantity, keep_price);
    }
});