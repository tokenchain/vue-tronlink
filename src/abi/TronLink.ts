import {Address} from "./base/Address"
import {TokenTrc20} from "./TokenTrc20";
import {
    TronLinkEventCaller,
    TronLinkTabReply,
    TronLinkToken,
    TronLinkTunnelMessage, TronMapContract,
    TronTRC20Token
} from "./base/types";
import {Vue} from "vue/types/vue";
import {txtUnit} from "./../utils/bnx";
import CoinDetail from "./CoinDetail";


/**
 * TronLink extension interaction functionality
 */
export default class TronLink {
    tronWeb: any
    tokens: TronLinkToken
    contracts: TronMapContract
    selected_function_reply: string
    selected_function_human_operation: string
    selected_function_caller: TronLinkEventCaller
    debug: boolean = false

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
        if (window && !window.hasOwnProperty("__tronlinkbase_codex")) {
            // @ts-ignore
            window.__tronlinkbase_codex = this
        }
    }

    public static Instance(): (TronLink | any | boolean) {
        if (window && window.hasOwnProperty("__tronlinkbase_codex")) {
            // @ts-ignore
            const obj = window.__tronlinkbase_codex
            if (obj instanceof TronLink) {
                return (obj) as TronLink
            } else {
                return (obj) as TronLink
            }
        } else {
            return false
        }
    }

    setDebug(x: boolean): void {
        this.debug = x
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

    async getCoin(trc20_coin: string): Promise<number> {
        return await this.getThirdTokenBalanceSun(this.getAccountAddress(), trc20_coin)
    }

    async getCoinFlo(trc20_coin: string): Promise<number> {
        return await this.getThirdTokenBalanceFloat(this.getAccountAddress(), trc20_coin)
    }

    async coinDPFlo(): Promise<number> {
        return await this.getCoinFlo("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }

    async coinCOLAFlo(): Promise<number> {
        return await this.getCoinFlo("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG")
    }

    async coinBTCFlo(): Promise<number> {
        return await this.getCoinFlo("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9")
    }

    async coinETHFlo(): Promise<number> {
        return await this.getCoinFlo("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF")
    }

    async coinSUNFlo(): Promise<number> {
        return await this.getCoinFlo("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9")
    }

    async coinUSDTFlo(): Promise<number> {
        return await this.getCoinFlo("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    }

    async coinDP(): Promise<number> {
        return await this.getCoin("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }

    async coinCOLA(): Promise<number> {
        return await this.getCoin("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG")
    }

    async coinBTC(): Promise<number> {
        return await this.getCoin("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9")
    }

    async coinETH(): Promise<number> {
        return await this.getCoin("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF")
    }

    async coinSUN(): Promise<number> {
        return await this.getCoin("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9")
    }

    async coinUSDT(): Promise<number> {
        return await this.getCoin("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    }

    async getMyCoinDetail(trc20_coin: string): Promise<CoinDetail> {
        return await this.getCoinDetail(this.getAccountAddress(), trc20_coin)
    }

    async coinDPDetail(): Promise<CoinDetail> {
        return await this.getMyCoinDetail("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR")
    }

    async coinCOLADetail(): Promise<CoinDetail> {
        return await this.getMyCoinDetail("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG")
    }

    async coinBTCDetail(): Promise<CoinDetail> {
        return await this.getMyCoinDetail("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9")
    }

    async coinETHDetail(): Promise<CoinDetail> {
        return await this.getMyCoinDetail("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF")
    }

    async coinSUNDetail(): Promise<CoinDetail> {
        return await this.getMyCoinDetail("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9")
    }

    async coinUSDTDetail(): Promise<CoinDetail> {
        return await this.getMyCoinDetail("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    }

    /**
     * get TRC20 token in balance
     * @param address
     * @param trc20
     */
    async getCoinDetail(address: string, trc20: string): Promise<CoinDetail> {
        if (!this.isLoggedIn()) {
            throw "wallet is not login"
        }

        if (!this.tokens.hasOwnProperty(trc20)) {
            await this.initCoinDetail(trc20, address)
        } else {
            let contract = this.contracts[trc20]
            if (!contract) {
                contract = await this.NewToken(trc20)
                this.contracts[trc20] = contract
            }
            const b = await contract.balanceOf(address)
            this.tokens[trc20].setHolder(address, txtUnit(b))
        }

        // @ts-ignore
        return this.tokens[trc20];
    }

    // @ts-ignore
    async initCoinDetail(trc20: string, me: string): Promise<CoinDetail> {
        const contract = await this.NewToken(trc20)
        const a = await contract.balanceOf(me)
        const d = await contract.decimals()
        const n = await contract.name()
        const s = await contract.symbol()
        const detail = new CoinDetail(trc20, d, s, n)
        detail.setHolder(me, txtUnit(a))
        this.tokens[trc20] = detail
        this.contracts[trc20] = contract
        return detail

    }

    async getContractToken(trc20: string): Promise<TokenTrc20> {
        let contract = this.contracts[trc20]
        if (!contract) {
            if (this.debug) {
                console.log("new contract token ...")
            }
            contract = await this.NewToken(trc20)
            this.contracts[trc20] = contract
        }
        return contract
    }


    // @ts-ignore
    async sendCoin(amount: any, toaddress: string,): Promise<void> {
        await this.tronWeb.trx.sendTransaction(toaddress, amount, {}, (err, receipt) => {
            if (err === undefined) {
                if (this.debug) {
                    console.log('- Output:', receipt, '\n');
                }
            }
        })
    }

    async sendTrc10Token(amount: any, tokenID: number, toaddress: string): Promise<void> {
        const receipt = await this.tronWeb.trx.sendToken(toaddress, amount, tokenID, {})
        if (this.debug) {
            console.log('- Output:', receipt, '\n');
        }
    }

    public async sendToken(amount: any, toaddress: string, trc20: string): Promise<void> {
        const contract = await this.NewToken(trc20);
        // @ts-ignore
        const send_amount = String(amount);
        await contract.transfer(toaddress, send_amount);
    }

    public async approveToken(trc20: string, spender_address: string, amount_sun: any): Promise<void> {
        const contract = await this.NewToken(trc20);
        const am = String(amount_sun)
        await contract.approve(spender_address, am)
    }

    public async getMyTokenBalance(trc20_coin: string): Promise<number> {
        return await this.getTokenBalanceSun(this.getAccountAddress(), trc20_coin)
    }

    async getTokenBalanceSun(address: string, trc20: string): Promise<number> {
        const detail = await this.getCoinDetail(address, trc20)
        return detail.balance(address)
    }

    async getUpdateAllowanceAmount(ins: CoinDetail, myaddress: string, spender: string): Promise<number> {
        if (!this.isLoggedIn()) {
            throw "wallet is not login"
        }
        const contract = await this.NewToken(ins.address)
        const allowance = await contract.allowance(myaddress, spender)
        const nm = txtUnit(allowance)
        ins.setSpender(myaddress, spender, nm)
        return ins.showAllowance(myaddress, spender)
    }

    async getThirdTokenBalanceSun(address: string, trc20_address: string): Promise<number> {
        const conver = await this.getCoinDetail(address, trc20_address)
        return conver.balance(address)
    }

    async getThirdTokenBalanceFloat(address: string, trc20_address: string): Promise<number> {
        const conver = await this.getCoinDetail(address, trc20_address)
        return conver.byFloat(address)
    }

    /**
     * to approve prespending TRC20 token on the go..
     * @param trc20_address
     * @param spender_address
     * @param amount_sun
     * @constructor
     */
    async ApproveSpendingToken(trc20_address: string, spender_address: string, amount_sun: number): Promise<boolean> {
        const token = await this.NewToken(trc20_address)
        return await token.approve(spender_address, String(amount_sun))
    }

    async NewToken(trc20_address: string): Promise<TokenTrc20> {
        const contract = new TokenTrc20(this.tronWeb)
        contract.setDebug(false)
        await contract.init(trc20_address)
        return contract
    }

    getListedCoins(): TronLinkToken {
        return this.tokens
    }

    explainTrc20(payload: TronTRC20Token): number {
        const me = this.getAccountAddress()
        return payload.holder[me]
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

    __debugMessage(data_message_raw: any): boolean {
        if (this.selected_function_caller) {
            this.selected_function_caller.debug(data_message_raw)
            return true
        } else {
            return false
        }
    }

    eventListener(message: any, tronLinkInitialData: boolean | any, vueInstance: Vue) {
        if (message.action === 'setNode') {
            // @ts-ignore
            vueInstance.announce_node_name(message.data.node.fullNode)
            vueInstance.$emit("notify_tron_node_change", message.data.node.fullNode)
        }


        if (message.action === 'setAccount') {
            if (message.hasOwnProperty("data")) {
                // @ts-ignore
                if (vueInstance.hasOwnProperty("account_name") && vueInstance.account_name !== message.data.name) {
                    vueInstance.$emit("notify_tron_account_set", message.data.name, message.data.address)
                }
                if (message.data.name === false) {
                    vueInstance.$emit("notify_tron_account_logout")
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
            console.group("TronLink Message 🖼")
            console.log("Action:", message.action)
            console.log(message.data)
            this.__debugMessage(message)
            console.groupEnd()
        }
    }
}
