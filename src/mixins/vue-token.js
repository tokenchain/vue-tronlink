import {TokenTrc20} from "../abi/TokenTrc20";

export default {
    data() {
        return {
            token_address: "",
            balance_of: 0,
            token_decimal: 0
        }
    },
    methods: {
        async init_coin_wallet(token_contract_address) {
            if (!TokenTrc20.Instance()) {
                const token = new TokenTrc20(this.tronWeb)
                await token.init(token_contract_address)
                this.token_decimal = await token.getDecimals()
                this.token_address = token_contract_address
            }
        },
        async wallet_scan_coin_amount(token_contract_address, funcb) {
            try {
                const amount = await TokenTrc20.Instance().getBalance(token_contract_address)
                this.balance_of = amount
                funcb(amount)
            } catch (e) {
            }
        },
    }
}
