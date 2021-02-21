import {Address} from "./base/Address"
import {TokenTrc20} from "./TokenTrc20";
import {
    TronLinkEventCaller,
    TronLinkTabReply,
    TronLinkToken,
    TronLinkTunnelMessage,
    TronTRC20Token
} from "./base/types";
import {Vue} from "vue/types/vue";

/**
 * TronLink extension interaction functionality
 */
export default class TronLink {
    tronWeb: any
    tokens: TronLinkToken
    selected_function_reply: string
    selected_function_human_operation: string
    selected_function_caller: TronLinkEventCaller


    /**
     * Initiates TronLink support object.
     *
     * @param {Object} tronWeb tronWeb entity object
     *           (details: https://github.com/tronprotocol/tron-web)
     */
    constructor(tronWeb) {
        this.tronWeb = tronWeb
        this.tokens = {}
        this.selected_function_human_operation = ""
    }

    /**
     * Checks if TronLink browser extension is installed
     */
    isInstalled(): boolean {
        return !!this.tronWeb
    }

    /**
     * Checks if user is logged in to the TronLink plugin
     */
    isLoggedIn(): boolean {
        return this.tronWeb && this.tronWeb.ready
    }

    /**
     * Checks if user is logged in to the TronLink plugin.
     * Alias for isLoggedIn() method.
     */
    isUnlocked(): boolean {
        return this.isLoggedIn()
    }

    /**
     * Returns logged in user Tron address
     */
    getAccountAddress(): string {
        return this.tronWeb.defaultAddress.base58
    }

    /**
     * returns the address with 41e...
     */
    getAccountAddressHex(): string {
        return this.tronWeb.defaultAddress.hex
    }

    /**
     * returns the address with 0x...
     */
    getAccountAddress0x(): string {
        return "0x" + this.getAccountAddressHex().substr(2)
    }

    NewContract(abi: any[] = [], address: boolean = false): any {
        return new this.tronWeb.Contract(this.tronWeb, abi, address)
    }

    removeAllFunctionCalls(): void {
        this.selected_function_human_operation = ""
    }

    /**
     * Converts Tron address from one format to another.
     *
     * @param {String, Number} address Address to convert
     * @param {String} fromFormat From format string
     * @param {String} toFormat To format string
     */
    convertAddress(address, fromFormat: string, toFormat: string): string {
        if (fromFormat == toFormat) {
            throw "From and To address formats are equal"
        }

        switch (toFormat) {
            case "hex":
                switch (fromFormat) {
                    case "base58":
                    case "tron":
                    case "trx":
                        return "0x" + this.tronWeb.address.toHex(address)
                }
                break
            case "base58":
            case "tron":
            case "trx":
                switch (fromFormat) {
                    case "hex":
                        if (!Address.isHexAddress(address)) {
                            throw "Invalid hex address"
                        }

                        if (address.startsWith("0x")) {
                            address = address.substr(2)
                        }

                        return this.tronWeb.address.fromHex(address)
                }
                break
        }

        throw "Invalid address formats"
    }

    /**
     * doesnt work on the older version
     * @deprecated
     */
    async coinTRX(): Promise<number> {
        let wallet_trx_coin = 0
        wallet_trx_coin = await this.tronWeb.trx.getBalance(this.getAccountAddress())
        return wallet_trx_coin
    }

    /**
     * the working version of get balance of coin trx the simple way
     * @param cb function callback
     * @param cberr function callback
     */
    getCoinTRX(cb, cberr): void {
        this.tronWeb.trx.getBalance(this.getAccountAddress(), (err, x) => {
            if (err == null) {
                cb(x)
            } else {
                cberr(err)
            }
        })
    }

    async getCoin(trc20_coin: string): Promise<TronTRC20Token> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), trc20_coin)
    }

    async coinDP(): Promise<TronTRC20Token> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }

    async coinCOLA(): Promise<TronTRC20Token> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG")
    }

    async coinBTC(): Promise<TronTRC20Token> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9")
    }

    async coinETH(): Promise<TronTRC20Token> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF")
    }

    async coinSUN(): Promise<TronTRC20Token> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9")
    }

    async coinUSDT(): Promise<TronTRC20Token> {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    }

    async getThirdTokenBalance(address: string, trc20_address: string): Promise<TronTRC20Token> {
        if (!this.isLoggedIn()) {
            throw "wallet is not login"
        }
        let contract
        if (!this.tokens.hasOwnProperty(trc20_address)) {
            contract = new TokenTrc20(this.tronWeb)
            contract.setDebug(false)
            await contract.init(trc20_address)

            const a = await contract.balanceOf(address)
            const d = await contract.decimals()

            this.tokens[trc20_address] = {
                instance: contract,
                address: trc20_address,
                decimal: d,
                hold: {}
            }

            this.tokens[trc20_address].hold[address] = a
        } else {
            contract = this.tokens[trc20_address].instance
            const aa = await contract.balanceOf(address)
            const dec = await contract.decimals()
            this.tokens[trc20_address].decimal = dec
            this.tokens[trc20_address].hold[address] = aa
        }

        return this.tokens[trc20_address];
    }

    getListedCoins(): TronLinkToken {
        return this.tokens
    }

    explainTrc20(payload: TronTRC20Token): number {
        const me = this.getAccountAddress()
        return payload.hold[me]
    }

    setCallbackFunctionCall(function_selector: string, caller: TronLinkEventCaller) {
        this.selected_function_human_operation = function_selector
        this.selected_function_caller = caller
    }

    __signOp(payload: TronLinkTunnelMessage): boolean {
        if (this.selected_function_human_operation == payload.data.input.function_selector) {
            this.selected_function_caller.signer(payload)
            return true
        } else {
            return false
        }
    }

    __signReply(payload: TronLinkTabReply): boolean {
        if (this.selected_function_caller != undefined && this.selected_function_human_operation != "") {
            this.selected_function_caller.reply(payload)
            this.selected_function_human_operation = ""
            return true
        } else {
            return false
        }
    }


    eventListener(message: any, tronLinkInitialData: boolean, vueInstance: Vue) {
        if (message.action === 'setNode') {
            // @ts-ignore
            vueInstance.announce_node_name(message.data.node.fullNode)
            vueInstance.$emit("notify_tron_node_change", message.data.node.fullNode)
        }


        if (message.action === 'setAccount') {
            if (typeof message === "object" && message.hasOwnProperty("data")) {
                // @ts-ignore
                if (vueInstance.hasOwnProperty("account_name") && vueInstance.account_name !== message.data.name) {
                    vueInstance.$emit("notify_tron_account_set", message.data.name, message.data.address)
                }
            }
        }


        if (message.action === 'tunnel') {
            if (message.data.hasOwnProperty("action") && message.data.action === 'sign') {
                if (message.data.hasOwnProperty("input") && message.data.input.hasOwnProperty("function_selector")) {
                    if (!this.__signOp(message.data)) {
                        vueInstance.$emit("notify_tron_opensign", message.uuid, message.data.input.function_selector, message.data)
                    }
                } else {
                    if (!this.__signOp(message.data)) {
                        vueInstance.$emit("notify_tron_opensign", message.uuid, message.data)
                    }
                }
            }
        }

        if (message.action === 'tabReply') {
            /**
             * response from the wallet sign action
             */
            if (message.data.hasOwnProperty("success")) {
                if (message.data.success === true) {
                    if (!this.__signReply(message.data)) {
                        vueInstance.$emit("notify_tron_sign_success_broadcast", message.data, message.uuid)
                    }
                } else {
                    this.removeAllFunctionCalls()
                }
            }

            if (!tronLinkInitialData) {
                if (typeof message === "object" && message.hasOwnProperty("data")) {
                    if (message.data.hasOwnProperty("data")) {
                        tronLinkInitialData = message.data.data;
                        if (message.data.hasOwnProperty("node")) {
                            // @ts-ignore
                            vueInstance.announce_node_name(message.data.node.full_node)
                        }
                        vueInstance.$emit("notify_tron_initialization", tronLinkInitialData)
                    } else {
                        console.log(message.data)
                    }
                }
            }
        }


        // @ts-ignore
        if (vueInstance.hasOwnProperty("_debug_tronlink") && vueInstance._debug_tronlink) {
            console.group("TronLink action hook")
            console.log("checker from-", message.action)
            console.log(message.data)
            console.groupEnd()
        }
    }
}
