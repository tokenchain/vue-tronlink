
import {Address} from "./base/Address"
// @ts-ignore
import {TokenTrc20} from "./abi/TokenTrc20";
import {TronLinkToken, TronTRC20Token} from "./base/types";

/**
 * TronLink extension interaction functionality
 */
export default class TronLink {
    tronWeb: any
    tokens: TronLinkToken

    /**
     * Initiates TronLink support object.
     *
     * @param {Object} tronWeb tronWeb entity object
     *           (details: https://github.com/tronprotocol/tron-web)
     */
    constructor(tronWeb) {
        this.tronWeb = tronWeb
        this.tokens = {}
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

    NewContract(abi: any[] = [], address: boolean = false): any {
        return new this.tronWeb.Contract(this.tronWeb, abi, address)
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

    async coinTRX(): Promise<number> {
        let wallet_trx_coin = 0
        await this.tronWeb.trx.getBalance(this.getAccountAddress(), (e, balance) => {
            wallet_trx_coin = balance
        })
        return wallet_trx_coin
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
}
