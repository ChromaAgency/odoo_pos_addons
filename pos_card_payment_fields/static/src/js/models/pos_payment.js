import { PosPayment } from "@point_of_sale/app/models/pos_payment";
import { patch } from "@web/core/utils/patch";

function _getOnChangeValue(e) {
    if (e && e.target) {
        return e.target.value;
    }
    return e;
}
patch(PosPayment.prototype, {
    setup() {
        super.setup(...arguments);
        this.terminal = '';
        this.lot = '';
        this.coupon = '';
        this.onChangeTerminal = this.onChangeTerminal.bind(this);
        this.onChangeLot = this.onChangeLot.bind(this);
        this.onChangeCoupon = this.onChangeCoupon.bind(this);
    },
    onChangeTerminal(e) {
        const terminal = _getOnChangeValue(e)
        this.update({ terminal });
    },
    
  onChangeLot(e) {
    const lot = _getOnChangeValue(e)
        this.update({ lot });
  },
  onChangeCoupon(e) {
    const coupon = _getOnChangeValue(e)
        this.update({ coupon });
  },

  
});
