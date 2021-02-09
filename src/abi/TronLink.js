import { Address } from "./base/Address";
import { TokenTrc20 } from "./TokenTrc20";
export default class TronLink {
    constructor(tronWeb) {
        this.tronWeb = tronWeb;
        this.tokens = {};
    }
    isInstalled() {
        return !!this.tronWeb;
    }
    isLoggedIn() {
        return this.tronWeb && this.tronWeb.ready;
    }
    isUnlocked() {
        return this.isLoggedIn();
    }
    getAccountAddress() {
        return this.tronWeb.defaultAddress.base58;
    }
    NewContract(abi = [], address = false) {
        return new this.tronWeb.Contract(this.tronWeb, abi, address);
    }
    convertAddress(address, fromFormat, toFormat) {
        if (fromFormat == toFormat) {
            throw "From and To address formats are equal";
        }
        switch (toFormat) {
            case "hex":
                switch (fromFormat) {
                    case "base58":
                    case "tron":
                    case "trx":
                        return "0x" + this.tronWeb.address.toHex(address);
                }
                break;
            case "base58":
            case "tron":
            case "trx":
                switch (fromFormat) {
                    case "hex":
                        if (!Address.isHexAddress(address)) {
                            throw "Invalid hex address";
                        }
                        if (address.startsWith("0x")) {
                            address = address.substr(2);
                        }
                        return this.tronWeb.address.fromHex(address);
                }
                break;
        }
        throw "Invalid address formats";
    }
    async coinTRX() {
        let wallet_trx_coin = 0;
        wallet_trx_coin = await this.tronWeb.trx.getBalance(this.getAccountAddress());
        return wallet_trx_coin;
    }
    getCoinTRX(cb, cberr) {
        this.tronWeb.trx.getBalance(this.getAccountAddress(), (err, x) => {
            if (err == null) {
                cb(x);
            }
            else {
                cberr(err);
            }
        });
    }
    async getCoin(trc20_coin) {
        return await this.getThirdTokenBalance(this.getAccountAddress(), trc20_coin);
    }
    async coinDP() {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
    }
    async coinCOLA() {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG");
    }
    async coinBTC() {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9");
    }
    async coinETH() {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF");
    }
    async coinSUN() {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9");
    }
    async coinUSDT() {
        return await this.getThirdTokenBalance(this.getAccountAddress(), "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
    }
    async getThirdTokenBalance(address, trc20_address) {
        if (!this.isLoggedIn()) {
            throw "wallet is not login";
        }
        let contract;
        if (!this.tokens.hasOwnProperty(trc20_address)) {
            contract = new TokenTrc20(this.tronWeb);
            contract.setDebug(false);
            await contract.init(trc20_address);
            const a = await contract.balanceOf(address);
            const d = await contract.decimals();
            this.tokens[trc20_address] = {
                instance: contract,
                address: trc20_address,
                decimal: d,
                hold: {}
            };
            this.tokens[trc20_address].hold[address] = a;
        }
        else {
            contract = this.tokens[trc20_address].instance;
            const aa = await contract.balanceOf(address);
            const dec = await contract.decimals();
            this.tokens[trc20_address].decimal = dec;
            this.tokens[trc20_address].hold[address] = aa;
        }
        return this.tokens[trc20_address];
    }
    getListedCoins() {
        return this.tokens;
    }
    explainTrc20(payload) {
        const me = this.getAccountAddress();
        return payload.hold[me];
    }
}
